import type { IGraphQLResponseError } from "../../types/graphql.types";

export type AnilistResponse<T> = {
    data: T,
    errors: Array<IGraphQLResponseError>;
}

//////////////////////////////////////////////////////////////////

export type AnilistDate = {
    month?: number,
    year?: number,
    day?: number,
}

export type AnilistMediaInfo = {
    id: number;
    idMal?: number;
    title: {
        english?: string,
        native?: string,
    };
    coverImage: {
        extraLarge?: string;
    };
    bannerImage?: string;
    averageScore?: number;
    siteUrl?: string;
    studios: {
        nodes?: {name: string}[];
    };
    startDate: AnilistDate;
};

export type AnilistMediaInfoResponseData = {
    Page: {
        media: AnilistMediaInfo[]
    }
}

export type AnilistMediaInfoRequest = {
    idIn: string[];
    sort: string;
}

export type AnilistMediaInfoResponse = AnilistResponse<AnilistMediaInfoResponseData>;

//////////////////////////////////////////////////////////////////

export type MediaAnilistUser = {
    score?: number;
    notes?: string;
    user: {
        avatar: {
            medium?: string;
        };
        name?: string;
        siteUrl?: string;
        id: number;
    }
}

export type AnilistUsersInfoResponseData = {
    Page: {
        mediaList: Record<string, MediaAnilistUser>
    }
}

export type AnilistUserInfoRequest = {
    idIn: number[];
    mediaId: number;
    format: "POINT_100"
}

export type AnilistUserInfoResponse = AnilistResponse<AnilistUsersInfoResponseData>;

//////////////////////////////////////////////////////////////////

export type AnilistUserFavorites = {
    about?: string;
    bannerImage?: string;
    favourites: {
        anime: {
            nodes: Array<{ id: number }>
        }
        characters: {
            nodes: Array<{
                id: number;
                name: {
                    full?: string;
                }
                image: {
                    medium?: string;
                }
                siteUrl?: string;
                media: {
                    nodes: Array<{ id: number }>
                }
            }>
        }
    }
}

export type AnilistUserFavoriesRequest = {
    id: number,
}

export type AnilistUserFavoritesResponse = AnilistResponse<{User: AnilistUserFavorites}>;

//////////////////////////////////////////////////////////////////