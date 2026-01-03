export type MediaClubApiResponse<T> = {
    success: boolean,
    data: T | null,
    error?: {
        message: string,
        code: string,
    }
}

export type WatchStatus = "completed" | "watching";

export type MediaClubMedia = {
    id: number,
    date_started: string,
    date_finished: string,
    status: WatchStatus,
}

export type MediaClubMediaResponse = MediaClubApiResponse<Array<MediaClubMedia>>;

export type AuthAnilistUserRequest = { code: string };

export type AuthAnilistUserResponse = MediaClubApiResponse<null>;