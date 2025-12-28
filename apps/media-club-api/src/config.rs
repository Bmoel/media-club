use crate::db::{media_repo::MediaRepo, users_repo::UsersRepo};
use crate::models::app::AppState;
use aws_sdk_dynamodb::Client;
use std::sync::Arc;
use tracing_subscriber::prelude::*;

pub fn init_environment() {
    dotenvy::dotenv().ok();
    std::env::set_var("AWS_LAMBDA_HTTP_IGNORE_STAGE_IN_PATH", "true");
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

pub async fn startup_app_state() -> Result<AppState, lambda_http::Error> {
    let media_table = std::env::var("DB_NAME_MEDIA")?;
    let users_table = std::env::var("DB_NAME_USERS")?;

    let config = if let Ok(local_url) = std::env::var("DYNAMO_LOCAL_ENDPOINT") {
        aws_config::defaults(aws_config::BehaviorVersion::latest())
            .endpoint_url(local_url)
            .load()
            .await
    } else {
        aws_config::load_from_env().await
    };

    let client = Arc::new(Client::new(&config));

    Ok(AppState {
        media_repository: Arc::new(MediaRepo::new(Arc::clone(&client), media_table)),
        users_repository: Arc::new(UsersRepo::new(Arc::clone(&client), users_table)),
    })
}
