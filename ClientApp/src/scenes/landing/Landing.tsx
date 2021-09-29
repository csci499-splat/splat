import React, { FC, ReactElement, useState } from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps}
    from 'react-router-dom';
import { Box, Paper, Grid, Button, TextField, Typography,
        styled, Stack, Divider, useTheme, Link, AppBar } from '@mui/material';
import Login from '../../components/common/Login';

type LandingProps = {
    loggedIn: boolean,
    setLoggedIn: (isLoggedIn: boolean) => void,
}

const Landing: FC<LandingProps> = (props: LandingProps): ReactElement => {

    const [loginOpen, setLoginOpen] = useState(false);

    const handleLogin = (email: string | null, pass: string | null): void => {
        alert(`Email='${email}', Password='${pass}'`);
        setLoginOpen(false);
        props.setLoggedIn(true);
    };

    return (
        <>
        {/* TODO: Add greeting, links at bottom, and login button*/}
        <Grid container spacing={2} sx={{height: 400}}>
            <Grid item xs={3} md={3} lg={3} />
            <Grid item xs={6} md={6} lg={6} sx={{marginTop: '10%'}}>
                <Stack spacing={5}>
                    <Typography
                    variant="h2"
                    color="secondary"
                    alignSelf="center"
                    >
                        Welcome to SPLAT!
                    </Typography>
                    <Divider />
                    { !props.loggedIn ? (
                        <Button 
                        onClick={() => setLoginOpen(true)}
                        variant="contained"
                        color="secondary" 
                        sx={{width: '25%', alignSelf: 'center'}}
                        >
                            Click here to log in
                        </Button>
                    ) : (
                        <Button 
                        variant="contained"
                        color="secondary"
                        sx={{width: '25%', alignSelf: 'center'}}
                        component={RouterLink} 
                        to="/student"
                        >
                            Begin your request
                        </Button>
                    )}
                </Stack>
            </Grid>
            <Grid item xs={3} md={3} lg={3} />
        </Grid>
        {loginOpen && (
            <Login
            loginHandler={handleLogin}
            onClose={() => setLoginOpen(false)}
            />
        )}
        </>
    );
}

export default Landing;
