use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::Response,
    Json,
};
use chrono::NaiveDate;
use serde::Serialize;

use crate::dto::{ApiError, ApiResponse};
use crate::state::AppState;

#[derive(Serialize)]
pub struct ScansByDay {
    pub date: NaiveDate,
    pub count: i64,
}

#[derive(Serialize)]
pub struct AnalyticsData {
    pub token: String,
    pub total_scans: i64,
    pub scans_by_day: Vec<ScansByDay>,
}

pub async fn get_analytics(
    State(state): State<AppState>,
    Path(token): Path<String>,
) -> Result<Json<ApiResponse<AnalyticsData>>, Response> {
    let record = sqlx::query!(
        "SELECT scan_count FROM qr_codes WHERE token = $1 AND deleted_at IS NULL",
        token
    )
    .fetch_optional(&state.pool)
    .await
    .map_err(|_| ApiError::new(StatusCode::INTERNAL_SERVER_ERROR, "Database error"))?
    .ok_or_else(|| ApiError::new(StatusCode::NOT_FOUND, "QR code not found"))?;

    Ok(ApiResponse::ok(AnalyticsData {
        token,
        total_scans: record.scan_count,
        scans_by_day: vec![],
    }))
}
