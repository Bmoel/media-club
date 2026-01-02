import type { IGraphQLResponseError } from "../../types/graphql.types";

export type AnilistResponse<T> = {
    data: T,
    errors: Array<IGraphQLResponseError>;
}

export type AnilistMediaInfoRequest = {
    idIn: number|string[];
    sort: string;
}

export type AnilistMediaInfo = {
    id: number;
    idMal: number;
    title: {
        english: string,
        native: string,
    };
    coverImage: {
        extraLarge: string;
    };
    bannerImage: string;
    averageScore: number;
    siteUrl: string;
    studios: {
        nodes: {name: string}[];
    };
    startDate: {
        month: number,
        year: number,
        day: number,
    };
};

export type AnilistMediaInfoResponseData = {
    Page: {
        media: AnilistMediaInfo[]
    }
}

export type AnilistMediaInfoResponse = AnilistResponse<AnilistMediaInfoResponseData>;

export type AnilistGetUserInfo = {
    id: number;
};

export type AnilistGetUserResponse = AnilistResponse<AnilistGetUserInfo>;