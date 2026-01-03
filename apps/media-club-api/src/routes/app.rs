use crate::models::app::AppState;
use crate::routes::auth_sync::auth_sync_route;
use crate::routes::{
    common::{default_route, welcome_route},
    media::media_route,
    users::users_route,
};
use axum::{routing::get, routing::post, Router};

pub fn create_router(state: AppState) -> Router {
    Router::new()
        .route("/", get(welcome_route))
        .route("/media", get(media_route))
        .route("/users", get(users_route))
        .route("/auth/sync", post(auth_sync_route))
        .fallback(default_route)
        .with_state(state)
}
