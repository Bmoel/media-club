use crate::errors::MyError;
use crate::models::app::{ApiResponse, AppState};
use crate::models::auth::{AuthRemovePayload, AuthSyncPayload};
use crate::services::auth_service;
use axum::{extract::State, Json};

pub async fn auth_sync_route(
    State(state): State<AppState>,
    Json(payload): Json<AuthSyncPayload>,
) -> Result<Json<ApiResponse<()>>, MyError> {
    auth_service::sync_user_profile(State(state), payload.code).await?;
    Ok(Json(ApiResponse {
        success: true,
        data: None,
        error: None,
    }))
}

pub async fn auth_remove_route(
    State(state): State<AppState>,
    Json(payload): Json<AuthRemovePayload>,
) -> Result<Json<ApiResponse<()>>, MyError> {
    auth_service::remove_user_profile(State(state), payload.code).await?;
    Ok(Json(ApiResponse {
        success: true,
        data: None,
        error: None,
    }))
}
