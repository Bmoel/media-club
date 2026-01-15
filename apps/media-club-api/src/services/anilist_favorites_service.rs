use std::collections::HashSet;

use crate::models::app::{AppState, GraphQLRequest};
use crate::{
    errors::MyError,
    models::{
        constants::anilist_constants::ANILIST_GRAPHQL_URL,
        favorites::{
            AniListResponse, AnimeFavs, CharacterFavs, CharacterResponse, FavoritesResponse,
            MangaFavs,
        },
    },
};
use tokio::join;

const MAX_ITERATIONS: i32 = 20;

pub async fn get_user_favorites(
    state: &AppState,
    user_id: i32,
) -> Result<FavoritesResponse, MyError> {
    let media_club_media = state.media_repository.get_media_entries().await?;
    let media_id_set: HashSet<i64> = media_club_media.iter().map(|item| item.id).collect();

    // These functions run in parallel!
    let anime_future = get_favorite_anime(&state, user_id, &media_id_set);
    let manga_future = get_favorite_manga(&state, user_id, &media_id_set);
    let characters_future = get_favorite_characters(&state, user_id, &media_id_set);

    let (anime_res, manga_res, characters_res) =
        join!(anime_future, manga_future, characters_future);

    Ok(FavoritesResponse {
        anime: anime_res?,
        manga: manga_res?,
        characters: characters_res?,
    })
}

async fn get_favorite_anime(
    state: &AppState,
    user_id: i32,
    media_id_map: &HashSet<i64>,
) -> Result<Vec<i32>, MyError> {
    let query = "query($id:Int,$page:Int){User(id:$id){favourites{anime(page:$page){nodes{id}pageInfo{hasNextPage}}}}}";

    let mut anime_list: Vec<i32> = Vec::new();
    for page in 1..MAX_ITERATIONS {
        let payload = GraphQLRequest {
            query,
            variables: serde_json::json!({"page": page, "id": user_id}),
        };

        let _permit = state.http_client_limiter.acquire().await.unwrap();
        let response: AniListResponse<AnimeFavs> = state
            .http_client
            .post(ANILIST_GRAPHQL_URL)
            .json(&payload)
            .send()
            .await
            .map_err(|e| MyError::Network(e))?
            .json()
            .await
            .map_err(|e| MyError::Internal(format!("Parse error for anime favorites: {}", e)))?;

        if let Some(errors) = response.errors {
            return Err(MyError::Internal(format!(
                "AniList API error for anime favs: {}",
                errors[0].message
            )));
        }

        let data = response
            .data
            .ok_or_else(|| MyError::Internal("AniList returned no data".into()))?;

        let anime_conn = data.user.favourites.anime;

        for anime in anime_conn.nodes {
            anime_list.push(anime.id);
        }
        let page_info = anime_conn
            .page_info
            .ok_or_else(|| MyError::Internal("No page info found".to_string()))?;
        if !page_info.has_next_page {
            break;
        }
    }

    Ok(anime_list
        .into_iter()
        .filter(|anime_id| media_id_map.contains(&i64::from(anime_id.clone())))
        .collect())
}

async fn get_favorite_manga(
    state: &AppState,
    user_id: i32,
    media_id_map: &HashSet<i64>,
) -> Result<Vec<i32>, MyError> {
    let query = "query($id:Int,$page:Int){User(id:$id){favourites{manga(page:$page){nodes{id}pageInfo{hasNextPage}}}}}";

    let mut manga_list: Vec<i32> = Vec::new();
    for page in 1..MAX_ITERATIONS {
        let payload = GraphQLRequest {
            query,
            variables: serde_json::json!({"page": page, "id": user_id}),
        };

        let _permit = state.http_client_limiter.acquire().await.unwrap();
        let response: AniListResponse<MangaFavs> = state
            .http_client
            .post(ANILIST_GRAPHQL_URL)
            .json(&payload)
            .send()
            .await
            .map_err(|e| MyError::Network(e))?
            .json()
            .await
            .map_err(|e| MyError::Internal(format!("Parse error for manga favorites: {}", e)))?;

        if let Some(errors) = response.errors {
            return Err(MyError::Internal(format!(
                "AniList API error for manga favs: {}",
                errors[0].message
            )));
        }

        let data = response
            .data
            .ok_or_else(|| MyError::Internal("AniList returned no data".into()))?;

        let manga_conn = data.user.favourites.manga;

        for manga in manga_conn.nodes {
            manga_list.push(manga.id);
        }
        let page_info = manga_conn
            .page_info
            .ok_or_else(|| MyError::Internal("No page info found".to_string()))?;
        if !page_info.has_next_page {
            break;
        }
    }

    Ok(manga_list
        .into_iter()
        .filter(|manga_id| media_id_map.contains(&i64::from(manga_id.clone())))
        .collect())
}

async fn get_favorite_characters(
    state: &AppState,
    user_id: i32,
    media_id_map: &HashSet<i64>,
) -> Result<Vec<CharacterResponse>, MyError> {
    let query = "query($id:Int,$page:Int){User(id:$id){favourites{characters(page:$page){nodes{id,name{full},image{medium},siteUrl,media{nodes{id}}}pageInfo{hasNextPage}}}}}";

    let mut character_list: Vec<CharacterResponse> = Vec::new();
    for page in 1..MAX_ITERATIONS {
        let payload = GraphQLRequest {
            query,
            variables: serde_json::json!({"page": page, "id": user_id}),
        };

        let _permit = state.http_client_limiter.acquire().await.unwrap();
        let response: AniListResponse<CharacterFavs> = state
            .http_client
            .post(ANILIST_GRAPHQL_URL)
            .json(&payload)
            .send()
            .await
            .map_err(|e| MyError::Network(e))?
            .json()
            .await
            .map_err(|e| {
                MyError::Internal(format!("Parse error for character favorites: {}", e))
            })?;

        if let Some(errors) = response.errors {
            return Err(MyError::Internal(format!(
                "AniList API error for character favs: {}",
                errors[0].message
            )));
        }

        let data = response
            .data
            .ok_or_else(|| MyError::Internal("AniList returned no data".into()))?;

        let character_conn = data.user.favourites.characters;

        for character in character_conn.nodes {
            for media in character.media.nodes {
                if media_id_map.contains(&i64::from(media.id.clone())) {
                    character_list.push(CharacterResponse {
                        id: character.id,
                        name: character.name,
                        image: character.image,
                        site_url: character.site_url,
                    });
                    break;
                }
            }
        }
        let page_info = character_conn
            .page_info
            .ok_or_else(|| MyError::Internal("No page info".to_string()))?;
        if !page_info.has_next_page {
            break;
        }
    }

    Ok(character_list)
}
