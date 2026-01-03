use crate::models::app::{ApiResponse, AppState};
use crate::models::auth::AuthSyncPayload;
use crate::services::auth_service;
use axum::{extract::State};
use axum::Json;

pub async fn auth_sync_route(
    State(state): State<AppState>,
    Json(payload): Json<AuthSyncPayload>,
) -> ApiResponse<()> {
    let auth_code = payload.code;
    let _result = auth_service::sync_user_profile(State(state), auth_code).await;

    ApiResponse {
        success: true,
        data: None,
        error: None,
    }
}