import { skipToken } from "@reduxjs/toolkit/query";
import { useGetUsersQuery } from "../api/mediaClub/mediaClubApi";
import { useMemo } from "react";
import { useAnilistUsersMediaInfoQuery } from "../api/anilist/anilistApi";
import type { AnilistUserInfoRequest } from "../api/anilist/anilistApi.types";

function useAnilistUsersMediaInfo(mediaId: number, skipQuery: boolean) {
    const { data: usersData } = useGetUsersQuery(undefined, {skip: skipQuery});

    const queryArgs: AnilistUserInfoRequest | undefined = useMemo(() => {
        if (usersData === undefined || usersData.length === 0) {
            return undefined;
        }
        const userIdList = usersData.map(user => user.user_id);
        return {idIn: userIdList, mediaId, format: "POINT_100"};
    }, [usersData, mediaId]);

    return useAnilistUsersMediaInfoQuery(queryArgs ?? skipToken);
}

export default useAnilistUsersMediaInfo;