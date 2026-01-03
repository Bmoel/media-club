use serde::{Serialize, Deserialize};
use crate::errors::MyError;

#[derive(Serialize)]
struct GraphQLRequest {
    query: &'static str,
    variables: serde_json::Value,
}

pub async fn exchange_code_for_token(
    http: &reqwest::Client,
    client_id: &str,
    client_secret: &str,
    redirect_uri: &str,
    code: &str,
) -> Result<String, MyError> {
    let payload = serde_json::json!({
        "grant_type": "authorization_code",
        "client_id": client_id,
        "client_secret": client_secret,
        "redirect_uri": redirect_uri,
        "code": code,
    });

    let res = http
        .post("https://anilist.co/api/v2/oauth/token")
        .json(&payload)
        .send()
        .await
        .map_err(|e| MyError::Network(e))?;

    #[derive(Deserialize)]
    struct TokenResponse { access_token: String }

    let data: TokenResponse = res.json().await
        .map_err(|_| MyError::Anilist("Invalid token response from AniList".into()))?;

    Ok(data.access_token)
}

pub async fn get_anilist_user_id(http: &reqwest::Client, token: &str) -> Result<i32, MyError> {
    let query = "
        query {
            Viewer {
                id
                name
            }
        }
    ";
    let payload = GraphQLRequest {
        query,
        variables: serde_json::json!({}),
    };

    let response = http
        .post("https://graphql.anilist.co")
        .bearer_auth(token)
        .json(&payload)
        .send()
        .await
        .map_err(|e| MyError::Network(e))?;

    let body: serde_json::Value = response.json().await
        .map_err(|_| MyError::Internal("Failed to parse AniList response".into()))?;

    let user_id = body["data"]["Viewer"]["id"]
        .as_i64()
        .ok_or_else(|| MyError::Anilist("User ID not found in response".into()))?;

    Ok(user_id as i32)
}