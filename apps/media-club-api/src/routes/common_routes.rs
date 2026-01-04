use crate::models::app::{ApiErrorDetail, ApiResponse};
use axum::{http::{StatusCode}, Json};

pub async fn welcome_route() -> Json<ApiResponse<String>> {
    Json(ApiResponse {
        success: true,
        data: Some("Welcome to media-club-api!".to_string()),
        error: None,
    })
}

pub async fn default_route() -> Json<ApiResponse<()>> {
    Json(ApiResponse {
        success: false,
        data: None,
        error: Some(ApiErrorDetail {
            code: StatusCode::BAD_REQUEST.to_string(),
            message: "Invalid route".to_string(),
        }),
    })
}
