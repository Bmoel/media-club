use crate::models::app::AppState;
use axum::{extract::State, http::StatusCode, response::IntoResponse, response::Response, Json};

pub async fn media_route(State(state): State<AppState>) -> Response {
    match state.media_repository.get_media_entries().await {
        Ok(items) => Json(items).into_response(),
        Err(_err) => (StatusCode::INTERNAL_SERVER_ERROR, "Database failed").into_response(),
    }
}
