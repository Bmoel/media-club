import { useParams } from "react-router";
import useGetMedia from "../hooks/useGetMedia";
import { Avatar, Box, Container, Grid, Stack, Typography } from "@mui/material";
import useConfig from "../hooks/useConfig";
import { useMemo } from "react";
import MediaPageBreadcrumbs from "../components/MediaPageBreadcrumbs";
import MediaScoreImageBox from "../components/common/MediaScoreImageBox";

function MediaPage() {
    const { id } = useParams();
    const { isMobile } = useConfig();
    const mediaInfo = useGetMedia(Number(id));

    const averageScoreBoxesGridSize: number = useMemo(() => isMobile ? 12 : 6, [isMobile]);

    return (
        <Container maxWidth="lg">
            <Stack spacing={2}>
                <MediaPageBreadcrumbs mediaInfo={mediaInfo} />
                <Grid container spacing={2}>
                    <Grid size={averageScoreBoxesGridSize}>
                        <MediaScoreImageBox
                            mediaSrc={mediaInfo?.coverImage.extraLarge ?? ''}
                            titleText="Anilist Average Score"
                            scoreText={'X'}
                        />
                    </Grid>
                    <Grid size={averageScoreBoxesGridSize}>
                        <MediaScoreImageBox
                            mediaSrc={'/chuuniland.svg'}
                            titleText="Media Club Average Score"
                            scoreText={'Y'}
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
                                {['member1', 'member2', 'member3', 'member4', 'member5'].map((member) => (
                                    <Box
                                        key={member}
                                        // onClick={() => setSelectedUser(member)}
                                        sx={{
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            opacity: 1,
                                            // opacity: selectedUser?.id === member.id ? 1 : 0.5,
                                            transition: '0.2s'
                                        }}
                                    >
                                        <Avatar
                                            src={'/chuuniland.svg'}
                                            sx={{
                                                width: 56,
                                                height: 56,
                                                border: '2px solid #1976d2'
                                                // border: selectedUser?.id === member.id ? '2px solid #1976d2' : 'none'
                                            }}
                                        />
                                        <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                            {member}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    </Grid>
                </Grid>
            </Stack>
        </Container>
    );
}

export default MediaPage;