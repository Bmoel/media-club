import { useGetUsersQuery } from "../api/mediaClub/mediaClubApi";
import { useAnilistUsersInfoQuery } from "../api/anilist/anilistApi";
import { useMemo } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import { type MediaClubUser } from "../api/mediaClub/mediaClubApi.types";

function getQueryInfo(users: MediaClubUser[]): {query: string, variables: Record<string, number>} | undefined {
    if (users.length === 0) {
        return undefined;
    }
    const variableDefinitions = users.map((_, i) => `$id${i}: Int`).join(', ');
    const userAliases = users.map((_, i) => `
        user${i}: User(id: $id${i}) {
            id
            name
            avatar { medium }
        }
    `).join('\n');

    const query = `query (${variableDefinitions}) { ${userAliases} }`;
    const variables: Record<string, number> = {};
    users.forEach((user, i) => {
        variables[`id${i}`] = user.user_id;
    }, {} as Record<string, number>);
    return {query, variables};
}

function useGetUsers() {
    const { data: usersData } = useGetUsersQuery(undefined);

    const anilistArgs = useMemo(() => {
        const memberIds = usersData ?? [];
        return memberIds.length > 0 ? getQueryInfo(memberIds) ?? skipToken : skipToken;
    }, [usersData]);

    const { data: users, isLoading } = useAnilistUsersInfoQuery(anilistArgs);

    return { users: users ?? [], isLoading };
}

export default useGetUsers;