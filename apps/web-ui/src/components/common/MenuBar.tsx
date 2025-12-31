import { AppBar, Avatar, Box, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, SwipeableDrawer, type SxProps, type Theme, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useCallback, useMemo, useState } from 'react';
import useConfig from '../../hooks/useConfig';
import { AppRegistration, Home } from '@mui/icons-material';
import { useNavigate } from 'react-router';

export default function MenuBar() {
    const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(false);

    const { isMobile, screenWidth } = useConfig();
    const navigate = useNavigate();

    const listCss: SxProps<Theme> = useMemo(() => {
        return isMobile
            ? { width: `${screenWidth * 0.6}px` }
            : { width: `${screenWidth * .15}px` };
    }, [isMobile, screenWidth]);

    const navigateAway = useCallback((location: string) => {
        setSideMenuOpen(false);
        navigate(location);
    }, [navigate]);

    return (
        <>
            <Box>
                <AppBar color='info' position='fixed'>
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={() => setSideMenuOpen(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Media Club
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Toolbar />
            </Box>
            <SwipeableDrawer
                open={sideMenuOpen}
                onClose={() => setSideMenuOpen(false)}
                onOpen={() => { }}
                anchor="left"
            >
                <List sx={listCss}>
                    <ListItem key={'title'}>
                        <ListItemAvatar>
                            <Avatar alt='chuuniland logo' src="chuuniland.svg" />
                        </ListItemAvatar>
                        <ListItemText>
                            <Typography fontWeight="bold">Media Club</Typography>
                        </ListItemText>
                    </ListItem>
                    <Divider sx={{ mx: 1 }} />
                    <ListItem
                        key={'main-page'}
                        onClick={() => navigateAway('/')}
                        disablePadding
                    >
                        <ListItemButton>
                            <ListItemIcon>
                                <Home color='info' />
                            </ListItemIcon>
                            <ListItemText primary={'Home'} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem
                        key={'registration-page'}
                        onClick={() => navigateAway('/registration')}
                        disablePadding
                    >
                        <ListItemButton>
                            <ListItemIcon>
                                <AppRegistration color='warning' />
                            </ListItemIcon>
                            <ListItemText primary={'Register'} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </SwipeableDrawer>
        </>
    );
}
