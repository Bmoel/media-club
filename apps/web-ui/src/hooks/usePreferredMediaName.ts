import { useCallback } from "react";
import type { AnilistMediaInfo } from "../api/anilist/anilistApi.types";

function usePreferredMediaName() {

    const getPreferredName = useCallback((names: AnilistMediaInfo['title']): string => {
        return names.english
                ?? names.userPreferred
                ?? names.romaji
                ?? names.native
                ?? '';
    }, []);

    return getPreferredName;
}

export default usePreferredMediaName;