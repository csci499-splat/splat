import { Box, Tab, Tabs } from '@mui/material';
import React, { FC, ReactElement, useState } from 'react';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import PrivateRoute from '../../components/PrivateRoute';
import User from '../../models/User';
import { getCurrentUserInfo } from '../../services/util/login';

import { StaffRoute, staffRoutes } from './pages/staffRoutes';

type StaffProps = {

}

export interface IStaffChild {
    pageName?: string;
};

const Staff: FC<StaffProps> = (props: StaffProps): ReactElement => {

    const routeMatch = useRouteMatch(staffRoutes.map(({ url }) => url));
    const currentTab = routeMatch?.path;

    return (
        <>
        <Box sx={{width: '100%', bgcolor: 'Background.paper'}}>
        <Tabs
        orientation="horizontal"
        scrollButtons="auto"
        value={currentTab}
        sx={{borderBottom: 1, borderColor: 'divider', marginBottom: 1}}
        indicatorColor="primary"
        textColor="secondary"
        centered
        >
            { staffRoutes.map((value: StaffRoute, index) => {
                let userInfo: User | null = getCurrentUserInfo();

                if(userInfo)
                    if(value.allowedRoles.indexOf(userInfo.role) !== -1)
                        return <Tab key={index} label={value.name.abbv} value={value.url} to={value.url} component={Link} icon={value.icon} />;
            })}
        </Tabs>
        </Box>
        <Switch>
        { staffRoutes.map((value: StaffRoute, index) => {
            return <PrivateRoute 
                    key={index} 
                    exact 
                    path={value.url} 
                    component={new React.Component(value.page, {...props, pageName: value.name.full})}
                    roles={value.allowedRoles}
                    />;
        })}
        <Route path='/'>
            <h1>404: Staff page not found</h1>
        </Route>
        </Switch>
        </>
    )
}

export default Staff;