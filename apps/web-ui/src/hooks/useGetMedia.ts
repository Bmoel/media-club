import { useMemo } from "react";
import useAnilistMediaQuery from "./useAnilistMediaQuery";
import type { Media } from "../types/media.types";

function useGetMedia(id?: number) {
    const mediaList = useAnilistMediaQuery();

    const media: Media | undefined = useMemo(() => {
        if (id === undefined || mediaList === undefined) {
            return undefined;
        }
        return mediaList.find(val => val.id === id);
    }, [mediaList, id]);

    return media; 
}

export default useGetMedia;