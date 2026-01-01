import { Box, Stack, Typography } from "@mui/material";

interface MediaScoreImageBoxProps {
    mediaSrc: string;
    titleText: string;
    scoreText: string;
}

function MediaScoreImageBox({ mediaSrc, scoreText, titleText }: MediaScoreImageBoxProps) {
    return (
        <Box
            sx={{ position: 'relative', height: 150, overflow: 'hidden', borderRadius: 2 }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${mediaSrc})`,
                    backgroundSize: 'cover',
                    filter: 'blur(8px) brightness(0.75)',
                    transform: 'scale(1.1)',
                }}
            />
            <Box sx={{ position: 'relative', p: 3, color: 'white', fontWeight: 'bold', textShadow: '0px 2px 4px rgba(0,0,0,0.5)' }}>
                <Stack justifyContent="center">
                    <Typography variant="overline">{titleText}:</Typography>
                    <Typography variant="h2">{scoreText}</Typography>
                </Stack>
            </Box>
        </Box>
    );
}

export default MediaScoreImageBox;