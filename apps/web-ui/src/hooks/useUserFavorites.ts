import { useCallback } from "react";
import { useGetUserFavoritesQuery } from "../api/mediaClub/mediaClubApi";
import type { AnilistCharacter } from "../api/mediaClub/mediaClubApi.types";

function useUserFavorites(userId?: number) {
    const {data: userFavorites, isLoading: userFavoritesAreLoading} = useGetUserFavoritesQuery(
        { user_id: userId as number },
        { skip: typeof userId !== 'number' }
    );

    const isFavoriteAnime = useCallback((animeId: number | undefined): boolean => {
        if (userFavorites === undefined || animeId === undefined || userFavoritesAreLoading) {
            return false;
        }
        return userFavorites.anime.some(id => id === animeId);
    }, [userFavorites, userFavoritesAreLoading]);

    const getFavoritesCharacters = useCallback((animeId: number | undefined): AnilistCharacter[] => {
        if (userFavorites === undefined || animeId === undefined || userFavoritesAreLoading) {
            return [];
        }
        return userFavorites.characters.filter(character => {
            return character.media.some(id => id === animeId);
        });
    }, [userFavorites, userFavoritesAreLoading]);

    return {
        isFavoriteAnime,
        getFavoritesCharacters,
        userFavoritesAreLoading
    };
}

export default useUserFavorites;