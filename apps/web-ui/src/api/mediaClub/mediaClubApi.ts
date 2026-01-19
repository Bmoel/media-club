import { baseApi } from "../baseApi";
import { MEDIA_CLUB_MEDIA_TAG, MEDIA_CLUB_USERS_TAG, MEDIA_CLUB_FAVORITES_TAG } from "./mediaClubApi.tags";
import type { MediaClubMediaResponse, AuthAnilistUserRequest, MediaClubUsersResponse, MediaClubUser, UserFavoritesRequest, UserFavoritesResponse, UserFavorites } from "./mediaClubApi.types";

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
        getUsers: build.query<MediaClubUser[], undefined>({
            query: () => ({
                url: `${BASE_URL}/users`,
                method: 'GET'
            }),
            providesTags: () => [MEDIA_CLUB_USERS_TAG],
            transformResponse: (response: MediaClubUsersResponse) => {
                return response.data ?? [];
            },
            transformErrorResponse: (response: {status: number, data: MediaClubUsersResponse}) => {
                const errorData = response.data;
                return errorData?.error?.message ?? "An unknown error occurred";
            }
        }),
        getUserFavorites: build.query<UserFavorites, UserFavoritesRequest>({
            query: ({ user_id, page }) => ({
                url: `${BASE_URL}/users/favorites`,
                method: 'POST',
                body: { user_id, page }
            }),
            providesTags: () => [MEDIA_CLUB_FAVORITES_TAG],
            transformResponse: (response: UserFavoritesResponse) => {
                return response.data ?? {characters: [], has_next_page: false};
            },
        }),
        syncAnilistUser: build.mutation<boolean, AuthAnilistUserRequest>({
            query: ({ code }) => ({
                url: `${BASE_URL}/auth/sync`,
                method: 'POST',
                body: { code },
            }),
            invalidatesTags: () => [MEDIA_CLUB_USERS_TAG],
        }),
        removeAnilistUser: build.mutation<boolean, AuthAnilistUserRequest>({
            query: ({ code }) => ({
                url: `${BASE_URL}/auth/remove`,
                method: 'POST',
                body: { code },
            }),
            invalidatesTags: () => [MEDIA_CLUB_USERS_TAG],
        }),
    }),
});

export const {
    useMediaClubMediaInfoQuery,
    useGetUsersQuery,
    useSyncAnilistUserMutation,
    useRemoveAnilistUserMutation,
    useGetUserFavoritesQuery,
    useLazyGetUserFavoritesQuery,
} = mediaClubApi;