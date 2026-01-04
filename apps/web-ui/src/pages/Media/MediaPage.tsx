import { useParams } from "react-router";
import useGetMedia from "../../hooks/useGetMedia";
import { Container, Fade, Grid, Stack, Typography } from "@mui/material";
import useConfig from "../../hooks/useConfig";
import { useMemo, useState } from "react";
import MediaPageBreadcrumbs from "./components/MediaPageBreadcrumbs";
import MediaScoreImageBox from "./components/MediaScoreImageBox";
import { type AnilistUser } from "../../api/anilist/anilistApi.types";
import useAnilistUsersMediaInfo from "../../hooks/useAnilistUsersMediaInfo";
import UserList from "./components/UserList";

function MediaPage() {
    const [selectedUser, setSelectedUser] = useState<AnilistUser | undefined>(undefined);

    const { id } = useParams();
    const { isMobile } = useConfig();
    const mediaInfo = useGetMedia(Number(id));
    const { data: anilistUsers } = useAnilistUsersMediaInfo(Number(id));

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
                                scoreText={`${mediaInfo?.averageScore?.toString() ?? '-'} / 100`}
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
                            />
                        </Grid>
                        {(selectedUser !== undefined) && (
                            <Grid size={12}>
                                <Stack>
                                    <Typography>{selectedUser.score}</Typography>
                                </Stack>
                            </Grid>
                        )}
                    </Grid>
                </Stack>
            </Fade>
        </Container >
    );
}

export default MediaPage;