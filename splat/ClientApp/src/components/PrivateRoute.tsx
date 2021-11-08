import React, { ReactElement } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { getCurrentUserInfo } from '../services/util/login';

// https://github.com/cornflourblue/react-role-based-authorization-example/blob/master/src/_components/PrivateRoute.jsx

const PrivateRoute = ({ component: Component, roles, ...rest }) => {
    return (
        <Route {...rest} render={(props) => {
            let user = getCurrentUserInfo();

            if(!user)
                return <Redirect to='/' />;

            // User does not have required role
            if(roles && roles.indexOf(user.role) === -1)
                return <Redirect to='/' />;

            return <Component {...props} />
        }}
        />
    );
};

export default PrivateRoute;
