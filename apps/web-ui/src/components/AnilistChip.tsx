import { Avatar, Chip, Link, Typography } from "@mui/material";
import useSafeAnilistUrl from "../hooks/useSafeAnilistUrl";

interface AnilistChipProps {
    href: string | undefined,
    label: string,
    ariaLabel: string,
}

function AnilistChip({ ariaLabel, href, label }: AnilistChipProps) {
    const getSafeAnilistUrl = useSafeAnilistUrl();

    return (
        <Chip
            avatar={<Avatar src={'/anilist.svg'} />}
            component={Link}
            target="_blank"
            rel="noopener noreferrer"
            href={getSafeAnilistUrl(href)}
            label={<Typography variant="overline">{label}</Typography>}
            color="info"
            variant="outlined"
            sx={{ background: 'black' }}
            aria-label={ariaLabel}
            clickable
        />
    );
}

export default AnilistChip;