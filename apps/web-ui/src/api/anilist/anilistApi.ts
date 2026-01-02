import { baseApi } from "../baseApi";
import { ANILIST_MEDIA_INFO_TAG } from "./anilistApi.tags";
import type { AnilistMediaInfo, AnilistMediaInfoRequest, AnilistMediaInfoResponse, AnilistGetUserResponse } from "./anilistApi.types";
import { MediaInfoQuery, GetUserIdQuery } from "./anilistApi.queries";

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
        getUserId: build.query<number, string>({
            query: (accessToken) => ({
                url: BASE_URL,
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: {
                    query: GetUserIdQuery,
                    variables: {},
                }
            }),
            transformResponse: (response: AnilistGetUserResponse) => {
                return response.data.id;
            },
            transformErrorResponse: (response: {status: number, data: AnilistMediaInfoResponse}) => {
                return response.data.errors;
            },
        })
    })
});

export const {useAnilistMediaInfoQuery, useLazyGetUserIdQuery} = anilistApi;