use lambda_http::{run, Error};

mod config;
mod db;
mod errors;
mod models;
mod routes;
mod services;

#[tokio::main]
async fn main() -> Result<(), Error> {
    std::env::set_var("AWS_LAMBDA_HTTP_IGNORE_STAGE_IN_PATH", "true");

    config::init_environment();
    config::init_telemetry();

    let app_state = config::startup_app_state().await?;

    let app = routes::app::create_router(app_state);

    run(app).await
}
