import { useMemo } from "react";
import useAnilistHomeMedia from "./useAnilistHomeMedia";
import type { Media } from "../types/media.types";

function useGetMedia(id?: number) {
    const {mediaList, mediaListIsLoading} = useAnilistHomeMedia();

    const media: Media | undefined = useMemo(() => {
        if (id === undefined || isNaN(id) || mediaList === undefined) {
            return undefined;
        }
        return mediaList.find(val => val.id === id);
    }, [mediaList, id]);

    return {media, mediaIsLoading: mediaListIsLoading}; 
}

export default useGetMedia;