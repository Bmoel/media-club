import { useMemo, useState } from "react";
import { Box, IconButton, ImageList, ImageListItem, ImageListItemBar, Stack, Typography } from "@mui/material";
import { Info } from "@mui/icons-material";
import { MEDIA } from "../constants/media";
import { useMediaInfoQuery } from "../api/anilist/anilistApi";
import type { MEDIA_INFO } from "../api/anilist/anilistApi.types";
import useConfig from "../hooks/useConfig";
import MediaInfoDrawer from "../components/MediaInfoDrawer";

function HomePage() {
    const [mediaInfoDrawerOpen, setMediaInfoDrawerOpen] = useState<boolean>(false);

    const { isMobile } = useConfig();

    const { data } = useMediaInfoQuery({
        idIn: Object.keys(MEDIA),
        sort: 'TITLE_ENGLISH',
    });

    const mediaList: MEDIA_INFO[] = useMemo(() => {
        return data?.data.Page.media ?? [];
    }, [data]);

    return (
        <>
            <Box
                sx={isMobile ? undefined : {
                    display: 'flex', // Use flexbox for centering
                    justifyContent: 'center', // Center horizontally
                    alignItems: 'center', // Center vertically
                }}
            >
                <Stack spacing={2}>
                    <Typography variant="h1" fontSize="32px">Media Club</Typography>
                    <ImageList cols={isMobile ? 2 : 3} gap={isMobile ? 8 : 16}>
                        {mediaList.map(media => {
                            return (
                                <ImageListItem key={media.id} className="element-slight-hover">
                                    <img src={media.coverImage.extraLarge} style={{ borderRadius: '10px' }} />
                                    <ImageListItemBar
                                        title={media.title.english}
                                        subtitle={media.title.native}
                                        actionIcon={
                                            <IconButton
                                                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                                aria-label={`An image for the anime "${media.title.english}"`}
                                                onClick={() => setMediaInfoDrawerOpen(true)}
                                            >
                                                <Info />
                                            </IconButton>
                                        }
                                        style={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }}
                                    />
                                </ImageListItem>
                            );
                        })}
                    </ImageList>
                </Stack>
            </Box>
            <MediaInfoDrawer isOpen={mediaInfoDrawerOpen} setIsOpen={(isOpen: boolean) => setMediaInfoDrawerOpen(isOpen)} />
        </>
    );
}

export default HomePage;