import { useNavigate, useParams } from "react-router";
import useGetMedia from "../hooks/useGetMedia";
import { Avatar, Box, Breadcrumbs, Container, Link, Tooltip, Typography } from "@mui/material";
import { Home, NavigateNext } from "@mui/icons-material";
import useConfig from "../hooks/useConfig";

function MediaPage() {
    const { id } = useParams();
    const { isMobile } = useConfig();
    const mediaInfo = useGetMedia(Number(id));
    const navigate = useNavigate();

    return (
        <Container maxWidth="lg">
            <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumbs">
                <Link
                    onClick={() => navigate('/')}
                    sx={{ display: 'flex', alignItems: 'center', cursor: "pointer" }}
                    underline="hover"
                    color="inherit"
                >
                    <Home sx={{ mr: 0.5 }} fontSize="inherit" />
                    Home
                </Link>
                <Box display="flex" alignItems="center">
                    <Avatar
                        alt='chuuniland logo'
                        src={mediaInfo?.coverImage.extraLarge ?? '/chuuniland.svg'}
                        sx={{ width: 22, height: 22, mr: 0.5 }}
                    />
                    <Tooltip title={mediaInfo?.title.english} enterDelay={500} arrow>
                        <Typography
                            noWrap
                            sx={{
                                maxWidth: isMobile ? '150px' : 'none',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                            color="text.primary"
                        >
                            {mediaInfo?.title.english}
                        </Typography>
                    </Tooltip>
                </Box>
            </Breadcrumbs>
        </Container>
    );
}

export default MediaPage;