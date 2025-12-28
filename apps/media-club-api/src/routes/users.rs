use crate::models::app::AppState;
use axum::{extract::State, http::StatusCode, response::IntoResponse, response::Response, Json};

pub async fn users_route(State(state): State<AppState>) -> Response {
    match state.users_repository.get_users().await {
        Ok(items) => Json(items).into_response(),
        Err(err) => {
            tracing::info!(err);
            (StatusCode::INTERNAL_SERVER_ERROR, "Database failed").into_response()
        },
    }
}
