use serde::Deserialize;

#[derive(Deserialize)]
pub struct AuthSyncPayload {
    pub code: String,
}

#[derive(Deserialize)]
pub struct AuthRemovePayload {
    pub code: String,
}
