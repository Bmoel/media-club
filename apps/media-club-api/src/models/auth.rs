use serde::Deserialize;

#[derive(Deserialize)]
pub struct AuthSyncPayload {
    pub code: String,
}