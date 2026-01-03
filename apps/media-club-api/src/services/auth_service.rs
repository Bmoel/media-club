use crate::{models::app::AppState};
use axum::{extract::State};

pub async fn sync_user_profile(
    _state: State<AppState>,
    _auth_code: String,
) -> Result<(), String> {
    Ok(())
}