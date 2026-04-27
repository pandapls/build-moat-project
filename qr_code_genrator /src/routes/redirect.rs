use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::Redirect,
};

use crate::state::AppState;

pub async fn redirect(
    State(state): State<AppState>,
    Path(token): Path<String>,
) -> Result<Redirect, StatusCode> {
    let record = sqlx::query!(
        "SELECT original_url, deleted_at, expires_at FROM qr_codes WHERE token = $1",
        token
    )
    .fetch_optional(&state.pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    match record {
        None => Err(StatusCode::NOT_FOUND),
        Some(row) => {
            if row.deleted_at.is_some() {
                return Err(StatusCode::GONE);
            }

            if let Some(expires_at) = row.expires_at {
                if expires_at < chrono::Utc::now() {
                    return Err(StatusCode::GONE);
                }
            }

            sqlx::query!(
                "UPDATE qr_codes SET scan_count = scan_count + 1 WHERE token = $1",
                token
            )
            .execute(&state.pool)
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

            Ok(Redirect::temporary(&row.original_url))
        }
    }
}
