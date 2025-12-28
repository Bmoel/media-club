use crate::models::{media::MediaRepository, users::UsersRepository};
use std::sync::Arc;

#[derive(Clone)]
pub struct AppState {
    pub media_repository: Arc<dyn MediaRepository + Send + Sync>,
    pub users_repository: Arc<dyn UsersRepository + Send + Sync>,
}
