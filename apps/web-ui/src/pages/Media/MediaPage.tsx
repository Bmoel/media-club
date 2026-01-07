import { useNavigate, useParams } from "react-router";
import useGetMedia from "../../hooks/useGetMedia";
import { Avatar, Box, Chip, Container, Fade, Grid, Link, Stack, Typography } from "@mui/material";
import useConfig from "../../hooks/useConfig";
import { useEffect, useMemo, useState } from "react";
import MediaPageBreadcrumbs from "./components/MediaPageBreadcrumbs";
import MediaScoreImageBox from "./components/MediaScoreImageBox";
import { type AnilistUser } from "../../api/anilist/anilistApi.types";
import useAnilistUsersMediaInfo from "../../hooks/useAnilistUsersMediaInfo";
import UserList from "./components/UserList";

function MediaPage() {
    const [selectedUser, setSelectedUser] = useState<AnilistUser | undefined>(undefined);

    const { id } = useParams();
    const { isMobile } = useConfig();
    const { media, mediaIsLoading } = useGetMedia(Number(id));
    const { data: anilistUsers, isFetching } = useAnilistUsersMediaInfo(
        Number(id),
        !(media?.media_club_status === 'completed')
    );
    const navigate = useNavigate();

    const averageScoreBoxesGridSize: number = useMemo(() => isMobile ? 12 : 6, [isMobile]);

    const mediaClubAverageScore: string = useMemo(() => {
        if (anilistUsers === undefined || anilistUsers.length === 0) {
            return '-';
        }
        let total = 0;
        let totalUsers = 0;
        anilistUsers.forEach(user => {
            const score = user?.score;
            if (typeof score === 'number') {
                total += score;
                totalUsers += 1;
            }
        });
        return totalUsers === 0 ? '-' : Math.ceil(total / totalUsers).toString();
    }, [anilistUsers]);

    useEffect(() => {
        if (!mediaIsLoading && !media) {
            navigate('/');
        }
    }, [media, mediaIsLoading, navigate]);

    return (
        <Container maxWidth="lg">
            <Fade in timeout={800}>
                <Stack spacing={2}>
                    <MediaPageBreadcrumbs mediaInfo={media} />
                    <Box>
                        <Chip
                            avatar={<Avatar src={'/anilist.svg'} />}
                            component={Link}
                            target="_blank"
                            rel="noopener noreferrer"
                            href={media?.siteUrl}
                            label={<Typography variant="overline">Anilist Page</Typography>}
                            color="info"
                            variant="outlined"
                            sx={{ background: 'black' }}
                            aria-label={`Visit anilist page for ${media?.title.english ?? media?.title.native}`}
                            clickable
                        />
                    </Box>
                    <Grid container spacing={2}>
                        <Grid size={averageScoreBoxesGridSize}>
                            <MediaScoreImageBox
                                mediaSrc={media?.coverImage.extraLarge ?? ''}
                                titleText="Anilist Average Score"
                                scoreText={`${media?.averageScore?.toString() ?? '-'} / 100`}
                            />
                        </Grid>
                        <Grid size={averageScoreBoxesGridSize}>
                            <MediaScoreImageBox
                                mediaSrc={'/chuuniland.svg'}
                                titleText="Media Club Average Score"
                                scoreText={`${mediaClubAverageScore} / 100`}
                            />
                        </Grid>
                        <Grid size={12}>
                            <UserList
                                anilistUsers={anilistUsers}
                                selectedUser={selectedUser}
                                setSelectedUser={setSelectedUser}
                                dataIsLoading={isFetching}
                            />
                        </Grid>
                        {(selectedUser !== undefined) && (
                            <>
                                <Grid size={12}>
                                    <Chip
                                        avatar={<Avatar src={'/anilist.svg'} />}
                                        component={Link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href={selectedUser.user.siteUrl}
                                        label={<Typography variant="overline">Anilist Profile</Typography>}
                                        color="info"
                                        variant="outlined"
                                        sx={{ background: 'black' }}
                                        aria-label="Visit anilist profile for the selected user"
                                        clickable
                                    />
                                </Grid>
                                <Grid size={isMobile ? 12 : 6}>
                                    <Stack
                                        spacing={1}
                                        alignItems="center"
                                        border="1px solid"
                                        borderColor="divider"
                                        borderRadius="8px"
                                        height={'100%'}
                                        display="flex"
                                    >
                                        <Typography variant="overline" color="text.secondary">USER SCORE</Typography>
                                        <Typography variant="h2" color="primary">{selectedUser.score ?? '-'}</Typography>
                                    </Stack>
                                </Grid>
                                <Grid size={isMobile ? 12 : 6}>
                                    <Stack
                                        spacing={1}
                                        alignItems="center"
                                        border="1px solid"
                                        borderColor="divider"
                                        borderRadius="8px"
                                        height={'100%'}
                                        display="flex"
                                        px={3}
                                    >
                                        <Typography variant="overline" color="text.secondary">REVIEW & NOTES</Typography>
                                        <Typography
                                            variant="body1"
                                            fontStyle="italic"
                                            alignItems="center"
                                            textAlign="center"
                                        >
                                            "{selectedUser.notes ?? "No notes have been provided for this title"}"
                                        </Typography>
                                    </Stack>
                                </Grid>
                            </>
                        )}
                    </Grid>
                </Stack>
            </Fade>
        </Container >
    );
}

export default MediaPage;