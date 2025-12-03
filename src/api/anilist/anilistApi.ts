import { baseApi } from "../baseApi";
import { MEDIA_INFO_TAG } from "./anilistApi.tags";
import type { MEDIA_INFO_REQUEST, MEDIA_INFO_RESPONSE } from "./anilistApi.types";

// GraphQl queries
import {MediaInfoQuery} from "./queries/mediaInfo.gql";

const BASE_URL: string = 'https://graphql.anilist.co';

const anilistApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        mediaInfo: build.query<MEDIA_INFO_RESPONSE, MEDIA_INFO_REQUEST>({
            query: (body) => ({
                url: BASE_URL,
                body: JSON.stringify({
                    query: MediaInfoQuery,
                    variables: body,
                }),
                method: 'POST',
            }),
            providesTags: () => [MEDIA_INFO_TAG],
        }),
    })
});

export const {useMediaInfoQuery} = anilistApi;