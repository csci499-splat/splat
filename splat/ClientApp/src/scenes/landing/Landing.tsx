import React, { FC, ReactElement, useState } from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps}
    from 'react-router-dom';
import { Box, Paper, Grid, Button, TextField, Typography,
        styled, Stack, Divider, useTheme, Link, AppBar, 
        IconButton, Alert, Collapse } from '@mui/material';
import Login from '../../components/common/Login';
import { baseRequest } from '../../services/api/genericRequest';
import { StaffMessage } from '../../models/StaffMessage';
import { Close } from '@mui/icons-material';

type LandingProps = {
    loggedIn: boolean,
    setLoggedIn: (isLoggedIn: boolean) => void,
}

const Landing: FC<LandingProps> = (props: LandingProps): ReactElement => {

    const [loginOpen, setLoginOpen] = useState(false);
    const [message, setMessage] = useState({open: false, message: ''});

    const handleLogin = (email: string | null, pass: string | null): void => {
        alert(`Email='${email}', Password='${pass}'`);
        setLoginOpen(false);
        props.setLoggedIn(true);
    };

    const handleGetMessage = async () => {
        let res = await baseRequest.get<StaffMessage>('/StaffMessages');
        if(res.data && res.data.message) 
            setMessage({open: true, message: res.data.message});
    };

    React.useEffect(() => {
        handleGetMessage();
    }, []);

    return (
        <>
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
                        sx={{width: '50%', alignSelf: 'center'}}
                        >
                            Click here to log in
                        </Button>
                    ) : (
                        <Button 
                        variant="contained"
                        color="secondary"
                        sx={{width: '50%', alignSelf: 'center'}}
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
        <Collapse in={message.open}>
            <Alert
            action={
                <IconButton
                color="inherit"
                size="small"
                onClick={() => setMessage({open: false, message: ''})}
                >
                    <Close fontSize="inherit" />
                </IconButton>
            }

            sx={{ mb: 2, zIndex: 25, position: 'absolute', top: '65px', left: 0, width: '100%' }}
            variant="filled"
            severity="info"
            >
                {message.message}
            </Alert>
        </Collapse>
        </>
    );
}

export default Landing;
