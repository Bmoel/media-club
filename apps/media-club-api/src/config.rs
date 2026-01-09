use crate::db::{media_repo::MediaRepo, users_repo::UsersRepo};
use crate::errors::MyError;
use crate::models::app::{AppState, EnvironmentVariables};
use aws_sdk_dynamodb::Client;
use std::sync::Arc;
use tracing_subscriber::prelude::*;

pub fn init_environment() {
    dotenvy::dotenv().ok();
}

pub fn init_telemetry() {
    // Only init if we are local, should not happen on PROD
    if std::env::var("DYNAMO_LOCAL_ENDPOINT").is_ok() {
        tracing_subscriber::registry()
            .with(tracing_subscriber::fmt::layer().pretty())
            .with(tracing_subscriber::EnvFilter::new("info"))
            .init();
    }
}

pub async fn startup_app_state() -> Result<AppState, MyError> {
    let environtment_vars = get_environment_variables()?;
    let config = if let Ok(local_url) = std::env::var("DYNAMO_LOCAL_ENDPOINT") {
        aws_config::defaults(aws_config::BehaviorVersion::latest())
            .endpoint_url(local_url)
            .load()
            .await
    } else {
        aws_config::load_from_env().await
    };

    let client = Arc::new(Client::new(&config));
    let http_client = reqwest::Client::builder()
        .user_agent("MediaClub-API/1.0")
        .build()
        .map_err(|_e| MyError::Internal("Failed to establish http client".into()))?;

    Ok(AppState {
        media_repository: Arc::new(MediaRepo::new(
            Arc::clone(&client),
            environtment_vars.media_table_name,
        )),
        users_repository: Arc::new(UsersRepo::new(
            Arc::clone(&client),
            environtment_vars.users_table_name,
        )),
        http_client: http_client,
        environment_variables: get_environment_variables()?,
    })
}

fn get_environment_variables() -> Result<EnvironmentVariables, MyError> {
    let media_table_name = std::env::var("DB_NAME_MEDIA")
        .map_err(|_| MyError::Internal("Failed to find DB_NAME_MEDIA".into()))?;
    let users_table_name = std::env::var("DB_NAME_USERS")
        .map_err(|_| MyError::Internal("Failed to find DB_NAME_USERS".into()))?;
    let client_id = std::env::var("ANILIST_CLIENT_APP_ID")
        .map_err(|_| MyError::Internal("Failed to find ANILIST_CLIENT_APP_ID".into()))?;
    let client_secret = std::env::var("ANILIST_CLIENT_APP_SECRET")
        .map_err(|_| MyError::Internal("Failed to find ANILIST_CLIENT_APP_SECRET".into()))?;
    let redirect_uri = std::env::var("ANILIST_REDIRECT_URI")
        .map_err(|_| MyError::Internal("Failed to find ANILIST_REDIRECT_URI".into()))?;

    Ok(EnvironmentVariables {
        media_table_name,
        users_table_name,
        client_id,
        client_secret,
        redirect_uri,
    })
}
