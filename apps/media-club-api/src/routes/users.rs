use crate::models::{
    app::{ApiErrorDetail, ApiResponse, AppState},
    users::User,
};
use axum::{extract::State, http::StatusCode};

pub async fn users_route(State(state): State<AppState>) -> ApiResponse<Vec<User>> {
    match state.users_repository.get_users().await {
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
                    message: "Failed to fetch users info".to_string(),
                }),
            }
        }
    }
}
