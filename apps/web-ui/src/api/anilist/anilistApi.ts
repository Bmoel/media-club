import { baseApi } from "../baseApi";
import { ANILIST_MEDIA_INFO_TAG, ANILIST_USERS_INFO_TAG } from "./anilistApi.tags";
import type { AnilistUserInfoRequest, AnilistUserInfoResponse, AnilistMediaInfo, AnilistMediaInfoRequest, AnilistMediaInfoResponse, AnilistUser } from "./anilistApi.types";
import { MediaInfoQuery, MediaListWithUsersQuery } from "./anilistApi.queries";

const BASE_URL: string = 'https://graphql.anilist.co';

const anilistApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        anilistMediaInfo: build.query<AnilistMediaInfo[], AnilistMediaInfoRequest>({
            query: (body) => ({
                url: BASE_URL,
                body: {
                    query: MediaInfoQuery,
                    variables: body,
                },
                method: 'POST',
            }),
            transformResponse: (response: AnilistMediaInfoResponse) => {
                return response.data.Page.media ?? [];
            },
            transformErrorResponse: (response: {status: number, data: AnilistMediaInfoResponse}) => {
                return response.data.errors;
            },
            providesTags: () => [ANILIST_MEDIA_INFO_TAG],
        }),
        anilistMediaListWithUsersQuery: build.query<AnilistUser[], AnilistUserInfoRequest>({
            query: (requestInfo) => ({
                url: BASE_URL,
                body: {
                    query: MediaListWithUsersQuery,
                    variables: requestInfo.variables,
                },
                method: 'POST',
            }),
            transformResponse: (response: AnilistUserInfoResponse) => {
                return Object.values(response.data).map(user => user);
            },
            transformErrorResponse: (response: {status: number, data: AnilistMediaInfoResponse}) => {
                return response.data.errors;
            },
            providesTags: [ANILIST_USERS_INFO_TAG],
        })
    })
});

export const {useAnilistMediaInfoQuery} = anilistApi;