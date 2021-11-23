import { Close } from '@mui/icons-material';
import { Alert, Button, Collapse, Divider, Grid, IconButton, Stack, Typography } from '@mui/material';
import React, { FC, ReactElement, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';

import Login from '../../components/common/Login';
import { StaffMessage } from '../../models/StaffMessage';
import { baseRequest } from '../../services/api/genericRequest';
import { login } from '../../services/util/login';

type LandingProps = {
    loggedIn: boolean,
    setLoggedIn: (isLoggedIn: boolean) => void,
}

const Landing: FC<LandingProps> = (props: LandingProps): ReactElement => {

    const [loginOpen, setLoginOpen] = useState(false);
    const [message, setMessage] = useState({open: false, message: ''});

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
        }
    };

    const handleGetMessage = async () => {
        try {
            let res = await baseRequest.get<StaffMessage>('/StaffMessages');
            if(res.data && res.data.message) 
                setMessage({open: true, message: res.data.message});
        } catch (error) { }
        
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
