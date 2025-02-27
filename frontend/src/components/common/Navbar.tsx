import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Box,
    Menu,
    MenuItem,
    Avatar,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Divider,
    useMediaQuery,
    useTheme
} from '@mui/material';
import {
    Menu as MenuIcon,
    Person as PersonIcon,
    Dashboard as DashboardIcon,
    ExitToApp as LogoutIcon,
    EventNote as EventNoteIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/authSlice';
import { AppDispatch } from '../../store';
import { UserRole } from '../../api/types';

const Navbar = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleCloseMenu();
        dispatch(logout());
        navigate('/');
    };

    const toggleDrawer = (open: boolean) => () => {
        setDrawerOpen(open);
    };

    const navLinks = [
        { title: 'Home', path: '/' },
        { title: 'Mentors', path: '/mentors' },
    ];

    const authLinks = [
        { title: 'Profile', path: '/profile', icon: <PersonIcon /> },
        { title: 'My Sessions', path: '/sessions', icon: <EventNoteIcon /> },
    ];

    if (user?.role === UserRole.ADMIN) {
        authLinks.push({ title: 'Dashboard', path: '/admin', icon: <DashboardIcon /> });
    }

    const mobileDrawer = (
        <Box sx={ { width: 250 } } role="presentation" onClick={ toggleDrawer(false) }>
            <Box sx={ { p: 2 } }>
                <Typography variant="h6" component="div">
                    Free Mentors
                </Typography>
            </Box>
            <Divider />
            <List>
                { navLinks.map((link) => (
                    <ListItem key={ link.title } disablePadding>
                        <ListItemButton component={ RouterLink } to={ link.path }>
                            <ListItemText primary={ link.title } />
                        </ListItemButton>
                    </ListItem>
                )) }
            </List>
            <Divider />
            { isAuthenticated ? (
                <>
                    <List>
                        { authLinks.map((link) => (
                            <ListItem key={ link.title } disablePadding>
                                <ListItemButton component={ RouterLink } to={ link.path }>
                                    <ListItemIcon>{ link.icon }</ListItemIcon>
                                    <ListItemText primary={ link.title } />
                                </ListItemButton>
                            </ListItem>
                        )) }
                        <ListItem disablePadding>
                            <ListItemButton onClick={ handleLogout }>
                                <ListItemIcon><LogoutIcon /></ListItemIcon>
                                <ListItemText primary="Logout" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </>
            ) : (
                <List>
                    <ListItem disablePadding>
                        <ListItemButton component={ RouterLink } to="/auth/login">
                            <ListItemText primary="Login" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={ RouterLink } to="/auth/signup">
                            <ListItemText primary="Sign Up" />
                        </ListItemButton>
                    </ListItem>
                </List>
            ) }
        </Box>
    );

    return (
        <AppBar position="sticky">
            <Toolbar>
                { isMobile && (
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={ { mr: 2 } }
                        onClick={ toggleDrawer(true) }
                    >
                        <MenuIcon />
                    </IconButton>
                ) }

                <Typography variant="h6" component="div" sx={ { flexGrow: 1 } }>
                    <RouterLink to="/" style={ { textDecoration: 'none', color: 'inherit' } }>
                        Free Mentors
                    </RouterLink>
                </Typography>

                { !isMobile && (
                    <Box sx={ { display: 'flex', alignItems: 'center', gap: 2 } }>
                        { navLinks.map((link) => (
                            <Button
                                key={ link.title }
                                color="inherit"
                                component={ RouterLink }
                                to={ link.path }
                            >
                                { link.title }
                            </Button>
                        )) }

                        { isAuthenticated ? (
                            <>
                                <IconButton
                                    onClick={ handleOpenMenu }
                                    color="inherit"
                                    sx={ { ml: 2 } }
                                    aria-controls="profile-menu"
                                    aria-haspopup="true"
                                >
                                    <Avatar
                                        sx={ { width: 32, height: 32 } }
                                        src={ user?.profilePicture }
                                    >
                                        { user?.firstName?.charAt(0) || 'U' }
                                    </Avatar>
                                </IconButton>
                                <Menu
                                    id="profile-menu"
                                    anchorEl={ anchorEl }
                                    open={ Boolean(anchorEl) }
                                    onClose={ handleCloseMenu }
                                    anchorOrigin={ {
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    } }
                                    transformOrigin={ {
                                        vertical: 'top',
                                        horizontal: 'right',
                                    } }
                                >
                                    <MenuItem
                                        component={ RouterLink }
                                        to="/profile"
                                        onClick={ handleCloseMenu }
                                    >
                                        <PersonIcon fontSize="small" sx={ { mr: 1 } } />
                                        Profile
                                    </MenuItem>

                                    <MenuItem
                                        component={ RouterLink }
                                        to="/sessions"
                                        onClick={ handleCloseMenu }
                                    >
                                        <EventNoteIcon fontSize="small" sx={ { mr: 1 } } />
                                        My Sessions
                                    </MenuItem>

                                    { user?.role === UserRole.ADMIN && (
                                        <MenuItem
                                            component={ RouterLink }
                                            to="/admin"
                                            onClick={ handleCloseMenu }
                                        >
                                            <DashboardIcon fontSize="small" sx={ { mr: 1 } } />
                                            Admin Dashboard
                                        </MenuItem>
                                    ) }

                                    <Divider />

                                    <MenuItem onClick={ handleLogout }>
                                        <LogoutIcon fontSize="small" sx={ { mr: 1 } } />
                                        Logout
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Box>
                                <Button
                                    color="inherit"
                                    component={ RouterLink }
                                    to="/auth/login"
                                >
                                    Login
                                </Button>
                                <Button
                                    color="secondary"
                                    variant="contained"
                                    component={ RouterLink }
                                    to="/auth/signup"
                                    sx={ { ml: 1 } }
                                >
                                    Sign Up
                                </Button>
                            </Box>
                        ) }
                    </Box>
                ) }
            </Toolbar>

            <Drawer
                anchor="left"
                open={ drawerOpen }
                onClose={ toggleDrawer(false) }
            >
                { mobileDrawer }
            </Drawer>
        </AppBar>
    );
};

export default Navbar;