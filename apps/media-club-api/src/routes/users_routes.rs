use std::collections::HashSet;

use crate::errors::MyError;
use crate::models::favorites::{FavoritesPayload, FavoritesResponse};
use crate::models::{
    app::{ApiResponse, AppState},
    users::User,
};
use crate::services::anilist_favorites_service;
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

pub async fn users_favorites_route(
    State(state): State<AppState>,
    Json(payload): Json<FavoritesPayload>,
) -> Result<Json<ApiResponse<FavoritesResponse>>, MyError> {
    let users = state.users_repository.get_users().await?;
    let user_id_set: HashSet<i64> = users.iter().map(|item| item.user_id).collect();
    if !user_id_set.contains(&i64::from(payload.user_id)) {
        // User does not exist in database -_-
        return Err(MyError::Internal("User does not exist".to_string()));
    }
    let favorites = anilist_favorites_service::get_user_favorites(&state, payload).await?;

    Ok(Json(ApiResponse {
        success: true,
        data: Some(favorites),
        error: None,
    }))
}
