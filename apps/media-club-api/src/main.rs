use crate::{
    db::{media_repo::MediaRepo, users_repo::UsersRepo},
    models::{app::AppState, media::MediaRepository, users::UsersRepository},
};
use aws_config::BehaviorVersion;
use aws_sdk_dynamodb::Client;
use axum::{routing::get, Router};
use lambda_http::{run, Error};
use std::{
    env::{set_var, var},
    sync::Arc,
};
use tracing_subscriber::{fmt, prelude::*, EnvFilter};

mod db;
mod models;
mod routes;

#[tokio::main]
async fn main() -> Result<(), Error> {
    // Add environment vars for local dev (doesn't do anything on PROD)
    dotenvy::dotenv().ok();

    // Handle removing stage from url
    set_var("AWS_LAMBDA_HTTP_IGNORE_STAGE_IN_PATH", "true");

    // Grab environment variables
    let media_table_name = var("DB_NAME_MEDIA").map_err(|_| "media table name not found")?;
    let users_table_name = var("DB_NAME_USERS").map_err(|_| "users table name not found")?;
    let dynamo_local_endpoint =
        std::env::var("DYNAMO_LOCAL_ENDPOINT").unwrap_or_else(|_| String::from(""));

    // Setup DB Client
    let shared_client;
    if dynamo_local_endpoint != "" {
        // Local specific code
        let config_loader = aws_config::defaults(BehaviorVersion::latest());
        let config = config_loader
            .endpoint_url(dynamo_local_endpoint)
            .load()
            .await;
        shared_client = Arc::new(Client::new(&config));
        // Setup logging ONLY for local. Should not happen for PROD
        tracing_subscriber::registry()
            .with(fmt::layer().pretty())
            .with(EnvFilter::new("info"))
            .init();
        tracing::info!("🚀 Local development mode: Logging enabled");
    } else {
        let config = aws_config::load_from_env().await;
        shared_client = Arc::new(Client::new(&config));
    }

    // Create Repositories
    let media_repo = MediaRepo::new(Arc::clone(&shared_client), media_table_name);
    let users_repo = UsersRepo::new(Arc::clone(&shared_client), users_table_name);

    let app_state = AppState {
        media_repository: Arc::new(media_repo) as Arc<dyn MediaRepository + Send + Sync>,
        users_repository: Arc::new(users_repo) as Arc<dyn UsersRepository + Send + Sync>,
    };

    let app = Router::new()
        .route("/", get(routes::common::welcome_route))
        .route("/media", get(routes::media::media_route))
        .route("/users", get(routes::users::users_route))
        .fallback(routes::common::default_route)
        .with_state(app_state);

    run(app).await
}
