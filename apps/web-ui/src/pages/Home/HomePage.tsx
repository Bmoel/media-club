import { useState } from "react";
import { Box, CircularProgress, Container, IconButton, ImageList, ImageListItem, ImageListItemBar, Typography, Zoom } from "@mui/material";
import { Info } from "@mui/icons-material";
import useConfig from "../../hooks/useConfig";
import MediaInfoDrawer from "../../components/MediaInfoDrawer";
import type { MediaInfoDrawerType } from "../../types/drawers.types";
import useAnilistHomeMedia from "../../hooks/useAnilistHomeMedia";
import { useNavigate } from "react-router";

function HomePage() {
    const [mediaInfoDrawer, setMediaInfoDrawer] = useState<MediaInfoDrawerType>({
        isOpen: false,
        id: undefined,
    });

    const { isMobile } = useConfig();
    const navigate = useNavigate();
    const { mediaList, mediaListIsLoading } = useAnilistHomeMedia();

    if (mediaListIsLoading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 25 }}>
                <CircularProgress size={80} sx={{ mb: 2 }} />
                <Typography variant="h6" align="center">Loading... (-■_■)</Typography>
            </Box>
        );
    }

    return (
        <>
            <Container maxWidth="lg">
                <Zoom in timeout={350}>
                    <ImageList
                        cols={isMobile ? 2 : 3}
                        gap={isMobile ? 8 : 16}
                    >
                        {mediaList?.map(media => {
                            return (
                                <ImageListItem key={media.id} className="element-slight-hover">
                                    <img
                                        src={media.coverImage.extraLarge}
                                        style={{ borderRadius: '10px', cursor: 'pointer' }}
                                        alt={`${media.title.english ?? 'anime'} cover image`}
                                        onClick={() => {
                                            if (isNaN(media.id)) {
                                                return;
                                            }
                                            navigate(`/media/${media.id}`);
                                        }}
                                    />
                                    <ImageListItemBar
                                        title={media.title.english ?? media.title.native ?? 'N/A'}
                                        subtitle={(media.title.english === undefined) ? undefined : (media.title.native ?? '')}
                                        actionIcon={
                                            <IconButton
                                                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                                aria-label={`An image for the anime "${media.title.english}"`}
                                                onClick={() => setMediaInfoDrawer({
                                                    isOpen: true,
                                                    id: media.id,
                                                })}
                                            >
                                                <Info />
                                            </IconButton>
                                        }
                                        style={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }}
                                    />
                                </ImageListItem>
                            );
                        }) ?? []}
                    </ImageList>
                </Zoom>
            </Container>
            <MediaInfoDrawer
                mediaInfoDrawer={mediaInfoDrawer}
                closeDrawer={() => setMediaInfoDrawer({
                    id: undefined,
                    isOpen: false,
                })}
            />
        </>
    );
}

export default HomePage;