use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use axum::{http::StatusCode, Json, response::{IntoResponse, Response}};

#[derive(Serialize)]
pub struct ApiResponse<T: Serialize> {
    pub success: bool,
    pub code: u16,
    pub data: Option<T>,
    pub message: Option<String>,
}

impl<T: Serialize> ApiResponse<T> {
    pub fn ok(data: T) -> Json<Self> {
        Json(Self {
            success: true,
            code: 200,
            data: Some(data),
            message: None,
        })
    }
}

#[derive(Serialize)]
pub struct ApiError {
    pub success: bool,
    pub code: u16,
    pub data: Option<()>,
    pub message: String,
}

impl ApiError {
    pub fn new(status: StatusCode, message: impl Into<String>) -> Response {
        let code = status.as_u16();
        let body = Json(Self {
            success: false,
            code,
            data: None,
            message: message.into(),
        });
        (status, body).into_response()
    }
}

#[derive(Debug, Deserialize)]
pub struct CreateRequest {
    pub url: String,
    pub expires_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateRequest {
    pub url: Option<String>,
    pub expires_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Serialize)]
pub struct CreateResponse {
    pub token: String,
    pub short_url: String,
    pub qr_code_url: String,
    pub original_url: String,
}
