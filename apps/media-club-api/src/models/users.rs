use async_trait::async_trait;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub id: i64,
}

#[async_trait]
pub trait UsersRepository: Send + Sync {
    async fn get_users(&self) -> Result<Vec<User>, String>;
}
