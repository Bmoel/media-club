import { baseApi } from "../baseApi";
import { MEDIA_CLUB_MEDIA_TAG } from "./mediaClubApi.tags";
import type { MediaClubMediaResponse, SyncAnilistUserRequest } from "./mediaClubApi.types";

const BASE_URL = import.meta.env.VITE_MEDIA_CLUB_API_BASE_URL;

const mediaClubApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        mediaClubMediaInfo: build.query<MediaClubMediaResponse['data'], undefined>({
            query: () => ({
                url: `${BASE_URL}/media`,
                method: 'GET',
            }),
            providesTags: () => [MEDIA_CLUB_MEDIA_TAG],
            transformResponse: (response: MediaClubMediaResponse) => {
                return response.data ?? [];
            },
            transformErrorResponse: (response: {status: number, data: MediaClubMediaResponse}) => {
                const errorData = response.data;
                return errorData?.error?.message ?? "An unknown error occurred";
            }
        }),
        syncAnilistUser: build.mutation<boolean, SyncAnilistUserRequest>({
            query: ({ code }) => ({
                url: `${BASE_URL}/auth/sync`,
                method: 'POST',
                body: { code },
            })
            //TODO: Add invalidatesTags for users query once that is made
        }),
    }),
});

export const {useMediaClubMediaInfoQuery, useSyncAnilistUserMutation} = mediaClubApi;