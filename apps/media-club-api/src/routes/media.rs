use crate::models::app::{ApiErrorDetail, ApiResponse, AppState};
use crate::models::media::MediaItem;
use axum::{extract::State, http::StatusCode};

pub async fn media_route(State(state): State<AppState>) -> ApiResponse<Vec<MediaItem>> {
    match state.media_repository.get_media_entries().await {
        Ok(items) => ApiResponse {
            success: true,
            data: Some(items),
            error: None,
        },
        Err(err) => {
            tracing::error!(error = %err, "Database operation failed");
            ApiResponse {
                success: false,
                data: None,
                error: Some(ApiErrorDetail {
                    code: StatusCode::INTERNAL_SERVER_ERROR.to_string(),
                    message: "Failed to fetch media info".to_string(),
                }),
            }
        }
    }
}
