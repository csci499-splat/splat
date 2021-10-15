import { LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import React, { FC, ReactElement } from 'react';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';

import NavBar from './components/common/NavBar';
import Landing from './scenes/landing/Landing';
import Staff from './scenes/staff/Staff';
import Student from './scenes/student/Student';
import darkTheme from './services/util/darkTheme';
import primaryTheme from './services/util/primaryTheme';
import { DarkmodeStates, useDarkmode } from './services/util/useDarkmode';

const App: FC<{}> = (): ReactElement => {
    // TODO: Create hooks for updating logged-in state and dark mode use
    const [currentTheme, setCurrentTheme] = useDarkmode();
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
                {/* TODO: Add AuthorizedRoutes for /student and /staff */}
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
