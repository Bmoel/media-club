export type MediaClubApiResponse<T> = {
    success: boolean,
    data: T | null,
    error?: {
        message: string,
        code: string,
    }
}

//////////////////////////////////////////////////////////////////

export type WatchStatus = "completed" | "watching";

export type MediaClubMedia = {
    id: number,
    date_started: string,
    date_finished: string,
    status: WatchStatus,
}

export type MediaClubMediaResponse = MediaClubApiResponse<Array<MediaClubMedia>>;

export type MediaClubUser = {
    user_id: number,
    created_at: string,
}

export type MediaClubUsersResponse = MediaClubApiResponse<Array<MediaClubUser>>;

//////////////////////////////////////////////////////////////////

export type AuthAnilistUserRequest = { code: string };

export type AuthAnilistUserResponse = MediaClubApiResponse<null>;

//////////////////////////////////////////////////////////////////

export type AnilistCharacter = {
    id: number;
    name: {
        full?: string;
    }
    image: {
        medium?: string;
    }
    siteUrl?: string;
    media: Array<number>,
}

export type UserFavorites = {
    characters: Array<AnilistCharacter>,
    has_next_page: boolean,
}

export type UserFavoritesRequest = {user_id: number, page: number};

export type UserFavoritesResponse = MediaClubApiResponse<UserFavorites>;

//////////////////////////////////////////////////////////////////