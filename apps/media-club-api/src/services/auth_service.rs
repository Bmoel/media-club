use crate::services::anilist_service;
use crate::{errors::MyError, models::app::AppState};
use axum::extract::State;

pub async fn sync_user_profile(state: State<AppState>, auth_code: String) -> Result<(), MyError> {
    let client_id = std::env::var("ANILIST_CLIENT_APP_ID")
        .map_err(|_| MyError::Internal("Failed to find ANILIST_CLIENT_APP_ID".into()))?;
    let client_secret = std::env::var("ANILIST_CLIENT_APP_SECRET")
        .map_err(|_| MyError::Internal("Failed to find ANILIST_CLIENT_APP_SECRET".into()))?;
    let redirect_uri = std::env::var("ANILIST_REDIRECT_URI")
        .map_err(|_| MyError::Internal("Failed to find ANILIST_REDIRECT_URI".into()))?;

    let token = anilist_service::exchange_code_for_token(
        &state.http_client,
        &client_id,
        &client_secret,
        &redirect_uri,
        &auth_code,
    )
    .await?;

    let user_id = anilist_service::get_anilist_user_id(&state.http_client, &token).await?;

    state.users_repository.add_user(&user_id).await?;

    Ok(())
}
