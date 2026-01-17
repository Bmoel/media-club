use std::collections::HashSet;

use crate::models::app::AppState;
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

    // These functions run in parallel
    let (anime_res, manga_res, characters_res) = join!(
        get_favorite_anime(state, user_id),
        get_favorite_manga(state, user_id),
        get_favorite_characters(state, user_id, &media_id_set)
    );

    let filtered_anime = anime_res?
        .into_iter()
        .filter(|id| media_id_set.contains(&(*id as i64)))
        .collect();

    let filtered_manga = manga_res?
        .into_iter()
        .filter(|id| media_id_set.contains(&(*id as i64)))
        .collect();

    Ok(FavoritesResponse {
        anime: filtered_anime,
        manga: filtered_manga,
        characters: characters_res?,
    })
}

async fn get_favorite_anime(state: &AppState, user_id: i32) -> Result<Vec<i32>, MyError> {
    let query = "query($id:Int,$page:Int){User(id:$id){favourites{anime(page:$page){nodes{id}pageInfo{hasNextPage}}}}}";

    let mut anime_list: Vec<i32> = Vec::new();
    for page in 1..MAX_ITERATIONS {
        let response: AniListResponse<AnimeFavs> = state
            .anilist_client
            .post_graphql(
                ANILIST_GRAPHQL_URL,
                query,
                serde_json::json!({"page": page, "id": user_id}),
                None,
            )
            .await?;

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

    Ok(anime_list)
}

async fn get_favorite_manga(state: &AppState, user_id: i32) -> Result<Vec<i32>, MyError> {
    let query = "query($id:Int,$page:Int){User(id:$id){favourites{manga(page:$page){nodes{id}pageInfo{hasNextPage}}}}}";

    let mut manga_list: Vec<i32> = Vec::new();
    for page in 1..MAX_ITERATIONS {
        let response: AniListResponse<MangaFavs> = state
            .anilist_client
            .post_graphql(
                ANILIST_GRAPHQL_URL,
                query,
                serde_json::json!({"page": page, "id": user_id}),
                None,
            )
            .await?;

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

    Ok(manga_list)
}

async fn get_favorite_characters(
    state: &AppState,
    user_id: i32,
    media_id_map: &HashSet<i64>,
) -> Result<Vec<CharacterResponse>, MyError> {
    let query = "query($id:Int,$page:Int){User(id:$id){favourites{characters(page:$page){nodes{id,name{full},image{medium},siteUrl,media{nodes{id}}}pageInfo{hasNextPage}}}}}";

    let mut character_list: Vec<CharacterResponse> = Vec::new();
    for page in 1..MAX_ITERATIONS {
        let response: AniListResponse<CharacterFavs> = state
            .anilist_client
            .post_graphql(
                ANILIST_GRAPHQL_URL,
                query,
                serde_json::json!({"page": page, "id": user_id}),
                None,
            )
            .await?;

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
            for media in &character.media.nodes {
                if media_id_map.contains(&(media.id as i64)) {
                    character_list.push(CharacterResponse {
                        id: character.id,
                        name: character.name.clone(),
                        image: character.image.clone(),
                        site_url: character.site_url.clone(),
                        media: character
                            .media
                            .nodes
                            .iter()
                            .filter(|m| media_id_map.contains(&(m.id as i64)))
                            .map(|m| m.id)
                            .collect(),
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
