use crate::models::app::AppState;
use crate::routes::{
    common::{default_route, welcome_route},
    media::media_route,
    users::users_route,
};
use axum::{routing::get, Router};

pub fn create_router(state: AppState) -> Router {
    Router::new()
        .route("/", get(welcome_route))
        .route("/media", get(media_route))
        .route("/users", get(users_route))
        .fallback(default_route)
        .with_state(state)
}
