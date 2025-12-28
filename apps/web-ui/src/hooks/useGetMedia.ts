import { useMemo } from "react";
import { type AnilistMediaInfo } from "../api/anilist/anilistApi.types";
import useAnilistMediaQuery from "./useAnilistMediaQuery";

function useGetMedia(id?: number) {
    const { data: mediaList } = useAnilistMediaQuery();

    const media: AnilistMediaInfo | undefined = useMemo(() => {
        if (id === undefined || mediaList === undefined) {
            return undefined;
        }
        return mediaList.find(val => val.id === id);
    }, [mediaList, id]);

    return media; 
}

export default useGetMedia;