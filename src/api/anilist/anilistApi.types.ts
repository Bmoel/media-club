import type { IGraphQLResponseError } from "../../types/graphql.types";

export type ANILIST_RESPONSE<T> = {
    data: {
        Page: {
            media: T[]
        }
    };
    errors: Array<IGraphQLResponseError>;
}

export type MEDIA_INFO_REQUEST = {
    idIn: number|string[],
    sort: string,
}

export type MEDIA_INFO = {
    id: number,
    title: {
        english: string,
        native: string,
    };
    coverImage: {
        extraLarge: string;
    }
};

export type MEDIA_INFO_RESPONSE = ANILIST_RESPONSE<MEDIA_INFO>;