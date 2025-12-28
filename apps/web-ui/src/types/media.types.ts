import type { AnilistMediaInfo } from "../api/anilist/anilistApi.types";
import type { WatchStatus } from "../api/mediaClub/mediaClubApi.types";

export type Media = AnilistMediaInfo & {
    media_club_date_started: Date | undefined,
    media_club_date_finished: Date | undefined,
    media_club_status: WatchStatus,
}