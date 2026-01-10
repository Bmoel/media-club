import { Box, Grid, Stack, Typography } from "@mui/material";
import AnilistChip from "../../../components/AnilistChip";
import type { MediaAnilistUser } from "../../../api/anilist/anilistApi.types";
import useUserFavorites from "../../../hooks/useUserFavorites";
import useConfig from "../../../hooks/useConfig";
import { Favorite } from "@mui/icons-material";
import type { Media } from "../../../types/media.types";
import MediaMemberInfoStack from "./MediaMemberInfoStack";
import CharacterList from "../../../components/CharacterList";

interface SelectUserInfoProps {
    selectedUser: MediaAnilistUser,
    media: Media,
}

function SelectedUserInfo({ selectedUser, media }: SelectUserInfoProps) {
    const { isMobile } = useConfig();
    const { getFavoritesCharacters, isFavoriteAnime } = useUserFavorites(selectedUser.user.id);

    return (
        <>
            <Grid size={12}>
                <Box display="flex" justifyContent="space-between">
                    <AnilistChip
                        label="User Profile"
                        href={selectedUser.user.siteUrl}
                        ariaLabel="Visit anilist profile for the selected user"
                    />
                    {isFavoriteAnime(media.id) && (
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Favorite color="error" />
                            <Typography variant="overline">Favorite</Typography>
                        </Stack>
                    )}
                </Box>
            </Grid>
            <Grid size={isMobile ? 12 : 6}>
                <MediaMemberInfoStack>
                    <Typography variant="overline" color="text.secondary">USER SCORE</Typography>
                    <Typography variant="h2" color="primary">{selectedUser.score ?? '-'}</Typography>
                </MediaMemberInfoStack>
            </Grid>
            <Grid size={isMobile ? 12 : 6}>
                <MediaMemberInfoStack>
                    <Typography variant="overline" color="text.secondary">REVIEW & NOTES</Typography>
                    <Typography
                        variant="body1"
                        fontStyle="italic"
                        alignItems="center"
                        textAlign="center"
                    >
                        {selectedUser.notes ?? "No notes have been provided for this title"}
                    </Typography>
                </MediaMemberInfoStack>
            </Grid>
            <Grid size={12}>
                <MediaMemberInfoStack>
                    <Typography variant="overline" color="text.secondary">FAVORITE CHARACTERS</Typography>
                    <CharacterList characters={getFavoritesCharacters(media?.id)} />
                </MediaMemberInfoStack>
            </Grid>
        </>
    );
}

export default SelectedUserInfo;