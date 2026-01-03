use crate::models::app::{ApiErrorDetail, ApiResponse};
use axum::http::StatusCode;

pub async fn welcome_route() -> ApiResponse<String> {
    ApiResponse {
        success: true,
        data: Some("Welcome to media-club-api!".to_string()),
        error: None,
    }
}

pub async fn default_route() -> ApiResponse<()> {
    ApiResponse {
        success: false,
        data: None,
        error: Some(ApiErrorDetail {
            code: StatusCode::BAD_REQUEST.to_string(),
            message: "Invalid route".to_string(),
        }),
    }
}
