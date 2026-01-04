import { useMemo } from "react";
import useAnilistHomeMedia from "./useAnilistHomeMedia";
import type { Media } from "../types/media.types";

function useGetMedia(id?: number) {
    const mediaList = useAnilistHomeMedia();

    const media: Media | undefined = useMemo(() => {
        if (id === undefined || mediaList === undefined) {
            return undefined;
        }
        return mediaList.find(val => val.id === id);
    }, [mediaList, id]);

    return media; 
}

export default useGetMedia;