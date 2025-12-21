#[derive(Clone)]
pub struct ClientState {
    pub db_client: aws_sdk_rdsdata::Client,
}
