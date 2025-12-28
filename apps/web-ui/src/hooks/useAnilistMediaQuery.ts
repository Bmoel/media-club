import { useAnilistMediaInfoQuery } from "../api/anilist/anilistApi";
import { useMediaClubMediaInfoQuery } from "../api/mediaClub/mediaClubApi";

function useAnilistMediaQuery() {
    const {data} = useMediaClubMediaInfoQuery(undefined);

    return useAnilistMediaInfoQuery(
        {
            idIn: data?.map(mediaEntry => mediaEntry.id.toString()) ?? [],
            sort: 'TITLE_ENGLISH',
        },
        { 
            skip: !data 
        }
    );
}

export default useAnilistMediaQuery;