use async_trait::async_trait;
use serde::{Deserialize, Serialize};

use crate::errors::MyError;

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub id: i64,
}

#[async_trait]
pub trait UsersRepository: Send + Sync {
    async fn get_users(&self) -> Result<Vec<User>, MyError>;
    async fn add_user(&self, user_id: &i32) -> Result<(), MyError>;
}
