use crate::errors::MyError;
use governor::DefaultDirectRateLimiter;
use std::sync::Arc;

#[derive(Clone)]
pub struct ThrottledClient {
    client: reqwest::Client,
    limiter: Arc<DefaultDirectRateLimiter>,
}

impl ThrottledClient {
    pub fn new(client: reqwest::Client, limiter: Arc<DefaultDirectRateLimiter>) -> Self {
        Self { client, limiter }
    }

    /// For OAuth exchanges: sends a flat JSON payload
    pub async fn post_raw_json<T, P>(&self, url: &str, payload: P) -> Result<T, MyError>
    where
        T: serde::de::DeserializeOwned,
        P: serde::Serialize,
    {
        self.limiter.until_ready().await;

        let res = self
            .client
            .post(url)
            .json(&payload)
            .send()
            .await
            .map_err(|_| MyError::Anilist("Failed to recieve anilist response".to_string()))?;

        res.json::<T>()
            .await
            .map_err(|e| MyError::Internal(format!("Parse error: {}", e)))
    }

    /// For GraphQL: wraps query/vars and supports an optional Bearer token
    pub async fn post_graphql<T, V>(
        &self,
        url: &str,
        query: &str,
        variables: V,
        token: Option<&str>,
    ) -> Result<T, MyError>
    where
        T: serde::de::DeserializeOwned,
        V: serde::Serialize,
    {
        self.limiter.until_ready().await;

        let payload = serde_json::json!({
            "query": query,
            "variables": variables,
        });

        let mut rb = self.client.post(url).json(&payload);

        if let Some(t) = token {
            rb = rb.bearer_auth(t);
        }

        let res = rb
            .send()
            .await
            .map_err(|_| MyError::Anilist("Failed to recieve anilist response".to_string()))?;

        res.json::<T>()
            .await
            .map_err(|e| MyError::Internal(format!("Parse error: {}", e)))
    }
}
