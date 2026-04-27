use axum::{
    Router,
    routing::{get, post},
};
use tower_http::cors::{Any, CorsLayer};

use crate::routes::{
    analytics::get_analytics,
    create::create_qr,
    manage::{delete_qr, get_qr, get_qr_image, list_qr, update_qr},
    redirect::redirect,
};
use crate::state::AppState;

pub mod analytics;
pub mod create;
pub mod manage;
pub mod redirect;

pub fn app_router(state: AppState) -> Router {
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    Router::new()
        .route("/api/qr", get(list_qr))
        .route("/api/qr/create", post(create_qr))
        .route(
            "/api/qr/:token",
            get(get_qr).patch(update_qr).delete(delete_qr),
        )
        .route("/api/qr/:token/analytics", get(get_analytics))
        .route("/api/qr/:token/images", get(get_qr_image))
        .route("/r/:token", get(redirect))
        .layer(cors)
        .with_state(state)
}
