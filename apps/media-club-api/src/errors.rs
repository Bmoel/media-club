use crate::models::app::{ApiErrorDetail, ApiResponse};
use axum::{
    response::{IntoResponse, Response},
    Json,
};
use lambda_http::http::StatusCode;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum MyError {
    #[error("AniList API error: {0}")]
    Anilist(String),

    #[error("Database failure")]
    Database(String),

    #[error("Network error: {0}")]
    Network(#[from] reqwest::Error),

    #[error("Internal server error: {0}")]
    Internal(String),
}

impl IntoResponse for MyError {
    fn into_response(self) -> Response {
        tracing::error!(error = %self, "Operation failed");

        let (status, message) = match self {
            MyError::Anilist(ref msg) => (StatusCode::BAD_GATEWAY, msg.clone()),
            MyError::Database(ref msg) => (StatusCode::INTERNAL_SERVER_ERROR, msg.clone()),
            MyError::Network(_) => (
                StatusCode::BAD_GATEWAY,
                "External service unreachable".into(),
            ),
            MyError::Internal(ref msg) => (StatusCode::INTERNAL_SERVER_ERROR, msg.clone()),
        };

        let body = Json(ApiResponse::<()> {
            success: false,
            data: None,
            error: Some(ApiErrorDetail {
                message,
                code: status.as_str().to_string(),
            }),
        });

        (status, body).into_response()
    }
}
