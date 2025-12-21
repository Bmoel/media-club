use crate::models::client_state::ClientState;
use axum::{
    body::Body,
    extract::State,
    http::{header, StatusCode},
    response::Response,
};
use serde_json::{json, Value};

pub async fn users_route(State(_state): State<ClientState>) -> Response {
    let users: Value = json!({});

    Response::builder()
        .status(StatusCode::OK)
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(users.to_string()))
        .unwrap()
}
