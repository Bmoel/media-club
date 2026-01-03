use crate::errors::MyError;
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
    async fn get_users(&self) -> Result<Vec<User>, MyError> {
        let result = self
            .client
            .scan()
            .table_name(&self.table_name)
            .send()
            .await
            .map_err(|e| MyError::Database(format!("DnyamoDB Scan Error: {}", e)))?;

        let items: Vec<User> = serde_dynamo::from_items(result.items.unwrap_or_default())
            .map_err(|e| MyError::Internal(format!("Serialization error: {}", e)))?;

        Ok(items)
    }

    async fn add_user(&self, user_id: &i32) -> Result<(), MyError> {
        let item = serde_json::json!({
            "user_id": user_id,
            "created_at": chrono::Utc::now().to_rfc3339(),
        });

        let item_attributes = serde_dynamo::to_item(item)
            .map_err(|e| MyError::Internal(format!("Serialization error: {}", e)))?;

        self.client
            .put_item()
            .table_name(&self.table_name)
            .set_item(Some(item_attributes))
            .send()
            .await
            .map_err(|e| MyError::Database(format!("DynamoDB PutItem Error: {}", e)))?;

        Ok(())
    }
}
