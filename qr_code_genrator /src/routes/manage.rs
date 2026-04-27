use axum::{
    Json,
    extract::{Path, Query, State},
    http::{StatusCode, header},
    response::{IntoResponse, Response},
};
use chrono::Utc;
use serde::Deserialize;

use crate::dto::{ApiError, ApiResponse, UpdateRequest};
use crate::models::QrCode;
use crate::state::AppState;
use crate::utils::qr::generate_qr_png;
use crate::utils::validator::validate_url;

pub async fn get_qr(
    State(state): State<AppState>,
    Path(token): Path<String>,
) -> Result<Json<ApiResponse<QrCode>>, Response> {
    let record = sqlx::query_as!(QrCode, "SELECT * FROM qr_codes WHERE token = $1", token)
        .fetch_optional(&state.pool)
        .await
        .map_err(|_| ApiError::new(StatusCode::INTERNAL_SERVER_ERROR, "Database error"))?
        .ok_or_else(|| ApiError::new(StatusCode::NOT_FOUND, "QR code not found"))?;

    if record.deleted_at.is_some() {
        return Err(ApiError::new(StatusCode::GONE, "QR code has been deleted"));
    }

    if let Some(expires_at) = record.expires_at {
        if expires_at < Utc::now() {
            return Err(ApiError::new(StatusCode::GONE, "QR code has expired"));
        }
    }

    Ok(ApiResponse::ok(record))
}

pub async fn update_qr(
    State(state): State<AppState>,
    Path(token): Path<String>,
    Json(body): Json<UpdateRequest>,
) -> Result<Json<ApiResponse<()>>, Response> {
    if let Some(ref url) = body.url {
        validate_url(url).map_err(|e| ApiError::new(StatusCode::BAD_REQUEST, e.to_string()))?;
    }

    sqlx::query!(
        "UPDATE qr_codes SET
            original_url = COALESCE($1, original_url),
            expires_at = COALESCE($2, expires_at),
            updated_at = NOW()
         WHERE token = $3 AND deleted_at IS NULL",
        body.url,
        body.expires_at,
        token
    )
    .execute(&state.pool)
    .await
    .map_err(|e| ApiError::new(StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(ApiResponse::ok(()))
}

pub async fn delete_qr(
    State(state): State<AppState>,
    Path(token): Path<String>,
) -> Result<Json<ApiResponse<()>>, Response> {
    sqlx::query!(
        "UPDATE qr_codes SET deleted_at = NOW() WHERE token = $1 AND deleted_at IS NULL",
        token
    )
    .execute(&state.pool)
    .await
    .map_err(|_| ApiError::new(StatusCode::INTERNAL_SERVER_ERROR, "Database error"))?;

    Ok(ApiResponse::ok(()))
}

pub async fn get_qr_image(
    State(state): State<AppState>,
    Path(token): Path<String>,
) -> Result<Response, StatusCode> {
    let record = sqlx::query!(
        "SELECT token, deleted_at, expires_at FROM qr_codes WHERE token = $1",
        token
    )
    .fetch_optional(&state.pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
    .ok_or(StatusCode::NOT_FOUND)?;

    if record.deleted_at.is_some() {
        return Err(StatusCode::GONE);
    }

    if let Some(expires_at) = record.expires_at {
        if expires_at < Utc::now() {
            return Err(StatusCode::GONE);
        }
    }

    let short_url = format!("{}/r/{}", state.base_url, token);
    let png_bytes = generate_qr_png(&short_url).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let mut headers = axum::http::HeaderMap::new();
    headers.insert(header::CONTENT_TYPE, "image/png".parse().unwrap());

    Ok((StatusCode::OK, headers, png_bytes).into_response())
}

#[derive(Deserialize)]
pub struct ListQuery {
    pub page: Option<i64>,
    pub size: Option<i64>,
}

pub async fn list_qr(
    State(state): State<AppState>,
    Query(query): Query<ListQuery>,
) -> Result<Json<ApiResponse<Vec<QrCode>>>, Response> {
    let page = query.page.unwrap_or(1).max(1);
    let size = query.size.unwrap_or(20).clamp(1, 100);
    let offset = (page - 1) * size;

    let records = sqlx::query_as!(
        QrCode,
        "SELECT * FROM qr_codes WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT $1 OFFSET $2",
        size,
        offset
    )
    .fetch_all(&state.pool)
    .await
    .map_err(|_| ApiError::new(StatusCode::INTERNAL_SERVER_ERROR, "Database error"))?;

    Ok(ApiResponse::ok(records))
}
