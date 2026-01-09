use crate::models::app::ApiResponse;
use axum::Json;

pub async fn welcome_route() -> Json<ApiResponse<String>> {
    Json(ApiResponse {
        success: true,
        data: Some("Welcome to media-club-api!".to_string()),
        error: None,
    })
}
