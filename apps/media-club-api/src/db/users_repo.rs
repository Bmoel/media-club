use crate::models::users::User;
use crate::models::users::UsersRepository;
use async_trait::async_trait;
use aws_sdk_dynamodb::Client;
use std::sync::Arc;

pub(crate) struct UsersRepo {
    client: Arc<Client>,
    table_name: String,
}

impl UsersRepo {
    pub fn new(client_state: Arc<Client>, table_name: String) -> Self {
        Self {
            client: client_state,
            table_name: table_name,
        }
    }
}

#[async_trait]
impl UsersRepository for UsersRepo {
    async fn get_users(&self) -> Result<Vec<User>, String> {
        let result = self
            .client
            .scan()
            .table_name(&self.table_name)
            .send()
            .await
            .map_err(|e| format!("DnyamoDB Scan Error: {}", e))?;

        let items: Vec<User> = serde_dynamo::from_items(result.items.unwrap_or_default())
            .map_err(|e| format!("Mapping Error: {}", e))?;

        Ok(items)
    }
}
