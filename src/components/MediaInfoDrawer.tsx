import { Stack, SwipeableDrawer, Typography, type SwipeableDrawerProps, type SxProps } from "@mui/material";
import useConfig from "../hooks/useConfig";
import { useMemo } from "react";
import type { Theme } from "@emotion/react";
import { Puller } from "./common/Puller";
import type { MEDIA_INFO_DRAWER } from "../types/mediaInfo.types";
import type { MEDIA_INFO } from "../api/anilist/anilistApi.types";

interface MediaInfoDrawerProps {
    mediaInfoDrawer: MEDIA_INFO_DRAWER;
    closeDrawer: () => void;
    mediaList: MEDIA_INFO[];
}

function MediaInfoDrawer({ mediaInfoDrawer, closeDrawer, mediaList }: MediaInfoDrawerProps) {
    const { isMobile } = useConfig();

    const media: MEDIA_INFO | undefined = useMemo(() => {
        if (mediaInfoDrawer.id === undefined) {
            return undefined;
        }
        return mediaList.find(val => val.id === mediaInfoDrawer.id);
    }, [mediaList, mediaInfoDrawer.id]);

    const stackCss: SxProps<Theme> = useMemo(() => {
        return isMobile ? { margin: '10px' } : { width: '400px', margin: '10px' };
    }, [isMobile]);

    const drawerSlotProps: SwipeableDrawerProps['slotProps'] = useMemo(() => {
        return isMobile ? {
            paper: {
                sx: { height: '85%' }
            }
        } : undefined;
    }, [isMobile]);

    return (
        <SwipeableDrawer
            open={mediaInfoDrawer.isOpen}
            onClose={closeDrawer}
            onOpen={() => { }}
            anchor={isMobile ? "bottom" : "right"}
            slotProps={drawerSlotProps}
        >
            <Stack spacing={2} sx={stackCss}>
                {isMobile && <Puller />}
                <Typography>{media?.title.english ?? ''}</Typography>
            </Stack>
        </SwipeableDrawer>
    );
}

export default MediaInfoDrawer;