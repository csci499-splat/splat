import React, { Component, FC, ReactElement } from 'react';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';
import Landing from './scenes/landing/Landing';
import Student from './scenes/student/Student';
import Staff from './scenes/staff/Staff';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, useMediaQuery } from '@mui/material';
import { useDarkmode, DarkmodeStates } from './services/util/useDarkmode';
import primaryTheme from './services/util/primaryTheme';
import darkTheme from './services/util/darkTheme';
import NavBar from './components/common/NavBar';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from '@mui/lab';

const App: FC<{}> = (): ReactElement => {
    // TODO: Create hooks for updating logged-in state and dark mode use
    const [currentTheme, setCurrentTheme, componentMounted] = useDarkmode();
    const history = useHistory();

    const [loggedIn, setLoggedIn] = React.useState(false);
    const theme = currentTheme === DarkmodeStates.DARK ? darkTheme : primaryTheme;

    React.useEffect(() => {
        if(!loggedIn) {
            history.push("/");
        }
    }, [loggedIn]);

    return (
        <>
        <BrowserRouter>
        <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <CssBaseline />
            <NavBar 
            loggedIn={loggedIn} 
            setLoggedIn={setLoggedIn} 
            useDarkmode={currentTheme === DarkmodeStates.DARK}
            setDarkmode={setCurrentTheme} />
            <Switch>
                <Route exact path='/' 
                render={(props) => <Landing {...props} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} 
                />
                {/* TODO: Add AuthorizedRoutes for /student and /staff + components*/}
                <Route exact path='/student' component={Student} /> 
                <Route path='/staff' component={Staff} />
                <Route path='/'>
                    <h1>404: You have reached a page that doesn't exist!</h1>
                </Route>
            </Switch>
        </LocalizationProvider>
        </ThemeProvider>
        </BrowserRouter>
        </>
    );
}

export default App;
