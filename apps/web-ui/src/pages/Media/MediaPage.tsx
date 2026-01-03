import { useParams } from "react-router";
import useGetMedia from "../../hooks/useGetMedia";
import { Avatar, Box, Container, Fade, Grid, Stack, Typography } from "@mui/material";
import useConfig from "../../hooks/useConfig";
import { useMemo, useState } from "react";
import MediaPageBreadcrumbs from "./components/MediaPageBreadcrumbs";
import MediaScoreImageBox from "./components/MediaScoreImageBox";
import { type AnilistUser } from "../../api/anilist/anilistApi.types";

function MediaPage() {
    const [selectedUser, setSelectedUser] = useState<AnilistUser | undefined>(undefined);
    const { id } = useParams();
    const { isMobile } = useConfig();
    const mediaInfo = useGetMedia(Number(id));

    const averageScoreBoxesGridSize: number = useMemo(() => isMobile ? 12 : 6, [isMobile]);

    return (
        <Container maxWidth="lg">
            <Fade in timeout={800}>
                <Stack spacing={2}>
                    <MediaPageBreadcrumbs mediaInfo={mediaInfo} />
                    <Grid container spacing={2}>
                        <Grid size={averageScoreBoxesGridSize}>
                            <MediaScoreImageBox
                                mediaSrc={mediaInfo?.coverImage.extraLarge ?? ''}
                                titleText="Anilist Average Score"
                                scoreText={`${mediaInfo?.averageScore.toString() ?? '-'} / 100`}
                            />
                        </Grid>
                        <Grid size={averageScoreBoxesGridSize}>
                            <MediaScoreImageBox
                                mediaSrc={'/chuuniland.svg'}
                                titleText="Media Club Average Score"
                                scoreText={'- / 100'}
                            />
                        </Grid>
                        <Grid size={12}>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="overline" sx={{ color: 'text.secondary', ml: 1 }}>
                                    Members
                                </Typography>
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    sx={{
                                        overflowX: 'auto',
                                        py: 1,
                                        px: 1,
                                        '&::-webkit-scrollbar': { display: 'none' }
                                    }}
                                >
                                    {[{ name: 'TEST', id: 1, avatar: { medium: '/chuuniland.svg' } }].map((user) => (
                                        <Box
                                            key={user.name}
                                            onClick={() => setSelectedUser(user)}
                                            sx={{
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                                opacity: selectedUser?.id === user.id ? 1 : 0.5,
                                                transition: '0.2s'
                                            }}
                                        >
                                            <Avatar
                                                src={user.avatar.medium}
                                                sx={{
                                                    width: 56,
                                                    height: 56,
                                                    border: selectedUser?.id === user.id ? '2px solid #1976d2' : 'none'
                                                }}
                                            />
                                            <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                                {user.name}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>
                        </Grid>
                    </Grid>
                </Stack>
            </Fade>
        </Container >
    );
}

export default MediaPage;