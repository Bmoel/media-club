import type { IGraphQLResponseError } from "../../types/graphql.types";

export type AnilistResponse<T> = {
    data: T,
    errors: Array<IGraphQLResponseError>;
}

export type AnilistMediaInfoRequest = {
    idIn: string[];
    sort: string;
}

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

export type AnilistMediaInfoResponse = AnilistResponse<AnilistMediaInfoResponseData>;

export type AnilistUser = {
    score?: number;
    notes?: string;
    user: {
        avatar: {
            medium?: string;
        };
        bannerImage?: string;
        name?: string;
        siteUrl?: string;
        id: number;
    }
}

export type AnilistUsersInfoResponseData = {
    Page: {
        mediaList: Record<string, AnilistUser>
    }
}

export type AnilistUserInfoRequest = {
    idIn: number[];
    mediaId: number;
    format: "POINT_100"
}

export type AnilistUserInfoResponse = AnilistResponse<AnilistUsersInfoResponseData>;