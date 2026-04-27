use axum::{Json, extract::State, http::StatusCode, response::Response};

use crate::dto::{ApiError, ApiResponse, CreateRequest, CreateResponse};
use crate::state::AppState;
use crate::utils::token::generate_token;
use crate::utils::validator::validate_url;

pub async fn create_qr(
    State(state): State<AppState>,
    Json(body): Json<CreateRequest>,
) -> Result<Json<ApiResponse<CreateResponse>>, Response> {
    let url = validate_url(&body.url)
        .map_err(|e| ApiError::new(StatusCode::BAD_REQUEST, e.to_string()))?;

    let token = generate_token();

    sqlx::query!(
        "INSERT INTO qr_codes (token, original_url, expires_at) VALUES ($1, $2, $3)",
        token,
        url,
        body.expires_at
    )
    .execute(&state.pool)
    .await
    .map_err(|e| ApiError::new(StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let short_url = format!("{}/r/{}", state.base_url, token);
    let qr_code_url = format!("{}/images/{}", state.base_url, token);

    Ok(ApiResponse::ok(CreateResponse {
        token,
        short_url,
        qr_code_url,
        original_url: url,
    }))
}
