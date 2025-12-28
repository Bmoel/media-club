import { Divider, Stack, SwipeableDrawer, Typography, type SwipeableDrawerProps, type SxProps } from "@mui/material";
import useConfig from "../hooks/useConfig";
import { useMemo } from "react";
import type { Theme } from "@emotion/react";
import { Puller } from "./common/Puller";
import type { MediaInfoDrawerType } from "../types/drawers.types";
import useGetMedia from "../hooks/useGetMedia";
import useDateFormat from "../hooks/useDateFormat";

interface MediaInfoDrawerProps {
    mediaInfoDrawer: MediaInfoDrawerType;
    closeDrawer: () => void;
}

function MediaInfoDrawer({ mediaInfoDrawer, closeDrawer }: MediaInfoDrawerProps) {
    const { isMobile } = useConfig();
    const formatDate = useDateFormat();

    const media = useGetMedia(mediaInfoDrawer?.id);

    const stackCss: SxProps<Theme> = useMemo(() => {
        return isMobile ? { margin: '10px' } : { width: '400px', margin: '10px' };
    }, [isMobile]);

    const drawerSlotProps: SwipeableDrawerProps['slotProps'] = useMemo(() => {
        return isMobile ? {
            paper: {
                sx: { height: '85%', borderRadius: '15px' },
                square: false,
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
                {media !== undefined && (
                    <>
                        <Typography fontWeight="bold">{media.title.english}</Typography>
                        <img
                            src={media.bannerImage}
                            alt={`Banner image for ${media.title.english}`}
                        />
                        <Divider />
                        <Typography fontWeight="bold">Anime start date</Typography>
                        <Typography>
                            {formatDate(new Date(media.startDate.year, media.startDate.month, media.startDate.day))}
                        </Typography>
                        {media.media_club_date_started && (
                            <>
                                <Typography fontWeight="bold">Media Club start date</Typography>
                                <Typography>{formatDate(media.media_club_date_started)}</Typography>
                            </>
                        )}
                        {media.media_club_date_finished && (
                            <>
                                <Typography fontWeight="bold">Media Club end date</Typography>
                                <Typography>{formatDate(media.media_club_date_finished)}</Typography>
                            </>
                        )}
                        <Divider />
                        <Typography fontWeight="bold">Anilist average score</Typography>
                        <Typography>{`${media.averageScore} / 100`}</Typography>
                        <Divider />
                        <Typography fontWeight="bold">Animation Studios</Typography>
                        {Array.isArray(media.studios.nodes) && media.studios.nodes.map((studioInfo, idx) => {
                            return <Typography key={`studio-name-${idx}`}>{studioInfo.name}</Typography>;
                        })}
                        <Divider />
                    </>
                )}
            </Stack>
        </SwipeableDrawer>
    );
}

export default MediaInfoDrawer;