import { Box, Stack, SwipeableDrawer, type SwipeableDrawerProps, type SxProps, Typography } from "@mui/material";
import useConfig from "../hooks/useConfig";
import { useMemo } from "react";
import type { Theme } from "@emotion/react";
import { Puller } from "./Puller";
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
                {media !== undefined && (
                    <>
                        {isMobile && <Puller />}
                        {media.bannerImage !== undefined && (
                            <Box sx={{ position: 'relative', height: 100, overflow: 'hidden', borderRadius: 2 }}>
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: 0, left: 0, right: 0, bottom: 0,
                                        backgroundImage: `url(${media.bannerImage})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        filter: 'blur(2px) brightness(0.75)',
                                        transform: 'scale(1.1)',
                                    }}
                                />
                                <Box sx={{
                                    position: 'relative',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    px: 2,
                                    textShadow: '0px 2px 4px rgba(0,0,0,0.5)'
                                }}
                                >
                                    <Typography color="white" fontSize="32px" fontWeight="bold" align="center">
                                        {media.title.english ?? media.title.native}
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                        {(typeof media.startDate.month === 'number') && (typeof media.startDate.day === 'number') && (typeof media.startDate.year === 'number') && (
                            <>
                                <Typography fontWeight="bold" variant="overline" color="text.secondary">Anime start date</Typography>
                                <Typography variant="body1" fontWeight="bold">
                                    {formatDate(new Date(media.startDate.year, media.startDate.month, media.startDate.day))}
                                </Typography>
                            </>
                        )}
                        {media.media_club_date_started && (
                            <>
                                <Typography fontWeight="bold" variant="overline" color="text.secondary">Media Club start date</Typography>
                                <Typography variant="body1" fontWeight="bold">{formatDate(media.media_club_date_started)}</Typography>
                            </>
                        )}
                        {media.media_club_date_finished && (
                            <>
                                <Typography fontWeight="bold" variant="overline" color="text.secondary">Media Club end date</Typography>
                                <Typography variant="body1" fontWeight="bold">{formatDate(media.media_club_date_finished)}</Typography>
                            </>
                        )}
                        {typeof media.averageScore === 'number' && (
                            <>
                                <Typography fontWeight="bold" variant="overline" color="text.secondary">Anilist average score</Typography>
                                <Typography variant="body1" fontWeight="bold">{`${media.averageScore} / 100`}</Typography>
                            </>
                        )}
                        {Array.isArray(media.studios.nodes) && (
                            <>
                                <Typography fontWeight="bold" variant="overline" color="text.secondary">Animation Studios</Typography>
                                {media.studios.nodes.map((studioInfo, idx) => {
                                    return <Typography variant="body1" fontWeight="bold" key={`studio-name-${idx}`}>{studioInfo.name}</Typography>;
                                })}
                            </>
                        )}
                    </>
                )
                }
            </Stack >
        </SwipeableDrawer >
    );
}

export default MediaInfoDrawer;