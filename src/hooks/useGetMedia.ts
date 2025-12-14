import { useMemo } from "react";
import { useMediaInfoQuery } from "../api/anilist/anilistApi";
import { MEDIA } from "../constants/media";
import { type MEDIA_INFO } from "../api/anilist/anilistApi.types";

function useGetMedia(id?: number) {
    const { data } = useMediaInfoQuery({
        idIn: Object.keys(MEDIA),
        sort: 'TITLE_ENGLISH',
    });

    const mediaList: MEDIA_INFO[] = useMemo(() => {
            return data?.data.Page.media ?? [];
    }, [data]);

    const media: MEDIA_INFO | undefined = useMemo(() => {
        if (id === undefined) {
            return undefined;
        }
        return mediaList.find(val => val.id === id);
    }, [mediaList, id]);

    return media; 
}

export default useGetMedia;