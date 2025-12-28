import { useAnilistMediaInfoQuery } from "../api/anilist/anilistApi";
import { useMediaClubMediaInfoQuery } from "../api/mediaClub/mediaClubApi";
import type { Media } from "../types/media.types";

function useAnilistMediaQuery(): Media[] | undefined {
    const {data: mediaClubMediaInfo} = useMediaClubMediaInfoQuery(undefined);

    const {data: anilistMediaInfo} = useAnilistMediaInfoQuery(
        {
            idIn: mediaClubMediaInfo?.map(mediaEntry => mediaEntry.id.toString()) ?? [],
            sort: 'TITLE_ENGLISH',
        },
        { 
            skip: !mediaClubMediaInfo 
        }
    );

    if (!anilistMediaInfo) {
        return undefined;
    }

    return anilistMediaInfo.map(info => {
        const mediaClubInfoObj = mediaClubMediaInfo?.find(mInfo => info.id === mInfo.id);
        const mClubStartDate = mediaClubInfoObj?.date_started;
        const mClubEndDate = mediaClubInfoObj?.date_finished;
        return {
            ...info,
            media_club_date_started: typeof mClubStartDate === 'string' ? new Date(mClubStartDate) : undefined,
            media_club_date_finished: typeof mClubEndDate === 'string' ? new Date(mClubEndDate) : undefined,
            media_club_status: mediaClubInfoObj?.status ?? 'completed',
        };
    });
}

export default useAnilistMediaQuery;