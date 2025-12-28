export type MediaClubApiResponse<T> = {
    success: boolean,
    data: T | null,
    error?: {
        message: string,
        code: string,
    }
}

export type WatchStatus = "completed" | "watching";

export type MediaClubMediaResponse = MediaClubApiResponse<Array<{
    id: number,
    date_started: string,
    date_finished: string,
    status: WatchStatus,
}>>