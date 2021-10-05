import React, { FC, ReactElement } from 'react';
import { AppBar, Box, Toolbar, Menu, MenuItem, 
    Typography, IconButton, ListItemIcon, ListItemText, Divider, Switch,
    Stack, Link, ListItem, Button, Container } 
    from '@mui/material';
import { AccountCircle, Login, Logout, DarkMode, LightMode, ListAlt } 
    from '@mui/icons-material';
import { DarkmodeStates } from '../../services/util/useDarkmode';
import { useHistory, Link as RouterLink } from 'react-router-dom';

type NavBarProps = {
    loggedIn: boolean,
    setLoggedIn: (isLoggedIn: boolean) => void,
    useDarkmode: boolean,
    setDarkmode: (darkmodeState: DarkmodeStates) => void
}

const NavBar: FC<NavBarProps> = (props: NavBarProps): ReactElement => {
    const loggedIn = props.loggedIn;

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const history = useHistory();

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const handleLogout = () => {
        handleClose();
        props.setLoggedIn(false);
    }

    const handleLogin = () => {
        handleClose();
        props.setLoggedIn(true);
    }

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
                            {/* TODO: Add logout function*/}
                            <MenuItem onClick={loggedIn ? handleLogout : handleLogin}>
                                <ListItemIcon>
                                    {loggedIn ? (
                                        <Logout fontSize="small" />         
                                    ) : (
                                        <Login fontSize="small" />
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
                    <Link to="/privacy"
                    color="inherit"
                    underline="always"
                    component={RouterLink}
                    >
                        Privacy
                    </Link>
                    <Link to="/staff"
                    color="inherit"
                    underline="always"
                    component={RouterLink}
                    >
                        Staff
                    </Link>
                </Stack>
            </AppBar>
        </>
    );
}

export default NavBar;