use lambda_http::{run, Error};

mod config;
mod db;
mod models;
mod routes;
mod services;

#[tokio::main]
async fn main() -> Result<(), Error> {
    config::init_environment();
    config::init_telemetry();

    let app_state = config::startup_app_state().await?;

    let app = routes::app::create_router(app_state);

    run(app).await
}
