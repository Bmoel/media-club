use aws_sdk_rdsdata as rdsdata;
use axum::{routing::get, Router};
use lambda_http::{run, tracing, Error};
use models::client_state::ClientState;
use std::env::set_var;

mod models;
mod routes;

#[tokio::main]
async fn main() -> Result<(), Error> {
    // Handle removing stage from url
    set_var("AWS_LAMBDA_HTTP_IGNORE_STAGE_IN_PATH", "true");

    // Setup tracing for lambda
    tracing::init_default_subscriber();

    // Setup DB
    let config = aws_config::load_from_env().await;
    let client = rdsdata::Client::new(&config);

    let client_state = ClientState { db_client: client };

    let app = Router::new()
        .route("", get(routes::common::welcome_route))
        .route("/media", get(routes::media::media_route))
        .route("/users", get(routes::users::users_route))
        .fallback(routes::common::default_route)
        .with_state(client_state);

    run(app).await
}
