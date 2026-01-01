import { Avatar, Box, Breadcrumbs, Tooltip, Typography } from "@mui/material";
import { NavigateNext } from "@mui/icons-material";
import type { Media } from "../types/media.types";
import useConfig from "../hooks/useConfig";
import HomeBreadcrumb from "./common/HomeBreadcrumb";

interface MediaPageBreadcrumbsProps {
    mediaInfo?: Media,
}

function MediaPageBreadcrumbs({ mediaInfo }: MediaPageBreadcrumbsProps) {
    const { isMobile } = useConfig();

    return (
        <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumbs">
            <HomeBreadcrumb />
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
    );
}

export default MediaPageBreadcrumbs;