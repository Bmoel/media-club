import { useMemo } from "react";
import { Box, IconButton, ImageList, ImageListItem, ImageListItemBar, Stack, Typography } from "@mui/material";
import { Info } from "@mui/icons-material";
import { MEDIA } from "../constants/media";
import { useMediaInfoQuery } from "../api/anilist/anilistApi";
import type { MEDIA_INFO } from "../api/anilist/anilistApi.types";

function HomePage() {
    const { data } = useMediaInfoQuery({
        idIn: Object.keys(MEDIA),
        sort: 'TITLE_ENGLISH',
    });

    const mediaList: MEDIA_INFO[] = useMemo(() => {
        return data?.data.Page.media ?? [];
    }, [data]);

    return (
        <Box>
            <Stack>
                <Typography variant="h4" align="center">Chuuniland Media Club</Typography>
                <ImageList>
                    {mediaList.map(media => {
                        return (
                            <ImageListItem key={media.id}>
                                <img src={media.coverImage.extraLarge} />
                                <ImageListItemBar
                                    title={media.title.english}
                                    subtitle={media.title.native}
                                    actionIcon={
                                        <IconButton
                                            sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                            aria-label={`An image for the anime "${media.title.english}"`}
                                        >
                                            <Info />
                                        </IconButton>
                                    }
                                />
                            </ImageListItem>
                        );
                    })}
                </ImageList>
            </Stack>
        </Box>
    );
}

export default HomePage;