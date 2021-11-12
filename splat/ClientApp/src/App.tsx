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
import { getLoggedIn } from './services/util/login';
import PrivateRoute from './components/PrivateRoute';
import { UserRoles } from './models/User';

const App: FC<{}> = (): ReactElement => {
    const [currentTheme, setCurrentTheme] = useDarkmode();
    const history = useHistory();

    const [loggedIn, setLoggedIn] = React.useState(getLoggedIn());
    const theme = currentTheme === DarkmodeStates.DARK ? darkTheme : primaryTheme;

    React.useEffect(() => {
        console.log("Set logged in to ", loggedIn);
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
                <PrivateRoute exact path='/student' roles={UserRoles}>
                    <Student />
                </PrivateRoute>
                <PrivateRoute path='/staff' roles={['Staff', 'Administrator']}>
                    <Staff />
                </PrivateRoute>
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
