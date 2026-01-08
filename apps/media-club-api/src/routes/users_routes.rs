use crate::errors::MyError;
use crate::models::{
    app::{ApiResponse, AppState},
    users::User,
};
use axum::{extract::State, Json};

pub async fn users_route(
    State(state): State<AppState>,
) -> Result<Json<ApiResponse<Vec<User>>>, MyError> {
    let users = state.users_repository.get_users().await?;

    Ok(Json(ApiResponse {
        success: true,
        data: Some(users),
        error: None,
    }))
}
