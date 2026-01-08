import { Avatar, Link, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import type { Character } from "../types/characters.types";

interface CharacterListProps {
    characters: Character[],
}

function CharacterList({ characters }: CharacterListProps) {
    if (characters.length === 0) {
        return <Typography
            variant="body1"
            fontStyle="italic"
            alignItems="center"
            textAlign="center"
        >
            No favorite characters found (´･_･`)
        </Typography>;
    }

    return (
        <List>
            {characters.map(character => {
                return (
                    <ListItem key={character.id}>
                        <ListItemAvatar>
                            <Avatar sx={{ width: 50, height: 50 }} variant="rounded" src={character.image ?? ''} alt={`${character.name ?? ''} image`} />
                        </ListItemAvatar>
                        <ListItemText>
                            <Link
                                href={character.siteUrl}
                                underline="always"
                                color="inherit"
                                target="_blank"
                                rel="noopener"
                                variant="overline"
                            >
                                {character.name}
                            </Link>
                        </ListItemText>
                    </ListItem>
                );
            })}
        </List>
    );
}

export default CharacterList;