import { AccountCircle, DarkMode, LightMode, ListAlt, Login as LoginIcon, Logout } from '@mui/icons-material';
import {
    AppBar,
    Button,
    Divider,
    IconButton,
    Link,
    ListItem,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Stack,
    Switch,
    Toolbar,
    Typography,
} from '@mui/material';
import React, { FC, ReactElement, useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';

import { DarkmodeStates } from '../../services/util/useDarkmode';
import { login, logout, getLoggedIn, getCurrentUserInfo } from '../../services/util/login';
import Login from './Login';
import { toast } from 'react-toastify';

type NavBarProps = {
    loggedIn: boolean,
    setLoggedIn: (isLoggedIn: boolean) => void,
    useDarkmode: boolean,
    setDarkmode: (darkmodeState: DarkmodeStates) => void
}

const NavBar: FC<NavBarProps> = (props: NavBarProps): ReactElement => {
    const loggedIn = props.loggedIn;

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [loginOpen, setLoginOpen] = useState(false);
    
    const history = useHistory();

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const handleLogout = async () => {
        await logout();
        handleClose();
        props.setLoggedIn(false);
    }

    const handleLoginOpen = async () => {
       setLoginOpen(true);
    }

    const handleLogin = async (email: string, pass: string) => {
        try {
            await login(email, pass, () => {});
            toast.success('Logged in successfully', {
                position: 'top-center',
                autoClose: 6000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: 0,
            });
            props.setLoggedIn(true);
        } catch(err) {
            
        } finally {
            setLoginOpen(false);
            handleClose();
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleDarkmodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.target.checked ? props.setDarkmode(DarkmodeStates.DARK) : props.setDarkmode(DarkmodeStates.LIGHT);
    }

    return (
        <>
            <AppBar position='static'>
                <Toolbar>
                    <div style={{flexGrow: 1, justifyContent: 'center', alignItems: 'center', 
                                display: 'flex'}}>
                    <Button component={RouterLink} sx={{textAlign: 'center'}} to="/">
                        <Typography variant='h5' component='div' sx={{color: 'text.primary'}}>
                            SPLAT
                        </Typography>
                    </Button>
                    </div>
                    <div>
                        <IconButton
                        size='large'
                        onClick={handleMenu}
                        color='inherit'
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        >
                            {loggedIn && (
                                <ListItem>
                                    {getCurrentUserInfo()?.name}
                                </ListItem>
                            )}
                            {loggedIn && (
                                <Divider />
                            )}
                            <MenuItem onClick={loggedIn ? handleLogout : handleLoginOpen}>
                                <ListItemIcon>
                                    {loggedIn ? (
                                        <Logout fontSize="small" />         
                                    ) : (
                                        <LoginIcon fontSize="small" />
                                    )}
                                </ListItemIcon>
                                <ListItemText>
                                    {props.loggedIn ? 'Log out' : 'Log in'}
                                </ListItemText>
                            </MenuItem>
                            {loggedIn && (
                                <MenuItem onClick={() => history.push('/student')}>
                                <ListItemIcon>
                                    <ListAlt />
                                </ListItemIcon>
                                <ListItemText>
                                    View your requests
                                </ListItemText>
                                </MenuItem>
                            )}
                            
                            <Divider />
                            <ListItem>
                                <ListItemIcon>
                                    {props.useDarkmode ? (
                                        <DarkMode fontSize="small" />
                                    ) : (
                                        <LightMode fontSize="small" />
                                    )}
                                </ListItemIcon>
                                <ListItemText>
                                    {props.useDarkmode ? 'Dark Mode' : 'Light Mode'}
                                </ListItemText>
                                <Switch
                                checked={props.useDarkmode}
                                onChange={handleDarkmodeChange}
                                />
                            </ListItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
            {/* Footer */}
            <AppBar
            color="primary"
            position="fixed"
            sx={{top: 'auto', bottom: 0}}
            >
                <Stack direction="row" spacing={2} padding={2}>
                    <Link href="https://www.uwsuper.edu/campuslife/services/food-shelf.cfm"
                    color="inherit"
                    underline="always"
                    rel="noopener"
                    target="_blank"
                    >
                        UW-Superior Yellowjacket Food Pantry
                    </Link>
                    <Link to="/staff/home"
                    color="inherit"
                    underline="always"
                    component={RouterLink}
                    >
                        Staff
                    </Link>
                </Stack>
            </AppBar>

            {loginOpen && (
            <Login
            loginHandler={handleLogin}
            onClose={() => setLoginOpen(false)}
            />
        )}
        </>
    );
}

export default NavBar;