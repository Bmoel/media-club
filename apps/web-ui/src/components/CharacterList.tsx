import { Avatar, Box, CircularProgress, Link, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import useSafeAnilistUrl from "../hooks/useSafeAnilistUrl";
import useUserFavorites, { type UserFavoritesError } from "../hooks/useUserFavorites";
import { useEffect, useState } from "react";
import { type AnilistCharacter } from "../api/mediaClub/mediaClubApi.types";

interface CharacterListProps {
    userId: number;
    mediaId: number;
}

function CharacterList({ userId, mediaId }: CharacterListProps) {
    const [characters, setCharacters] = useState<AnilistCharacter[] | UserFavoritesError>([]);

    const getSafeAnilistUrl = useSafeAnilistUrl();

    const { getFavoritesCharacters, charactersAreLoading } = useUserFavorites();

    useEffect(() => {
        const controller = new AbortController();

        const loadData = async () => {
            const data = await getFavoritesCharacters(userId, controller.signal);

            if (!controller.signal.aborted) {
                setCharacters(data);
            }
        };

        loadData();

        return () => controller.abort();
    }, [getFavoritesCharacters, userId]);

    const filteredCharacters = Array.isArray(characters) ? characters?.filter(char =>
        char.media?.includes(mediaId)
    ) : [];

    if (charactersAreLoading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
                <CircularProgress size={60} sx={{ mb: 2 }} />
                <Typography variant="h6" align="center">Loading... (-■_■)</Typography>
            </Box>
        );
    }

    if (typeof characters === 'object' && 'error' in characters) {
        return (
            <Typography variant="body1" fontStyle="italic" color="error" textAlign="center">
                {characters.error}
            </Typography>
        );
    }

    if (filteredCharacters.length === 0) {
        return (
            <Typography variant="body1" fontStyle="italic" textAlign="center" color="text.secondary">
                No favorite characters found for this show (´･_･`)
            </Typography>
        );
    }

    return (
        <List>
            {filteredCharacters.map(character => (
                <ListItem key={character.id}>
                    <ListItemAvatar>
                        <Avatar
                            sx={{ width: 50, height: 50 }}
                            variant="rounded"
                            src={character.image.medium ?? ''}
                            alt={character.name.full ?? 'Character'}
                        />
                    </ListItemAvatar>
                    <ListItemText
                        primary={
                            <Link
                                href={getSafeAnilistUrl(character.siteUrl)}
                                underline="always"
                                color="inherit"
                                target="_blank"
                                rel="noopener"
                                variant="overline"
                            >
                                {character.name.full ?? 'Character has no name （；¬＿¬)'}
                            </Link>
                        }
                    />
                </ListItem>
            ))}
        </List>
    );
}

export default CharacterList;