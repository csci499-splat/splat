import { Box, Tab, Tabs } from '@mui/material';
import React, { FC, ReactElement, useState } from 'react';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';

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
                if(value.adminOnly) {
                    // TODO: Check if user is an admin, only show tab if they are
                    return <Tab key={index} label={value.name.abbv} value={value.url} to={value.url} component={Link} icon={value.icon} />
                } else {
                    return <Tab key={index} label={value.name.abbv} value={value.url} to={value.url} component={Link} icon={value.icon} />
                }
            })}
        </Tabs>
        </Box>
        <Switch>
        { staffRoutes.map((value: StaffRoute, index) => {
            if(value.adminOnly) {
                // TODO: Change to a secure admin route
                return <Route key={index} exact path={value.url} render={(props) => React.cloneElement(value.page, {...props, pageName: value.name.full})} />
            } else {
                // TODO: Change to a secure staff auth route
                return <Route key={index} exact path={value.url} render={(props) => React.cloneElement(value.page, {...props, pageName: value.name.full})} />
            }
        })}
        <Route path='/'>
            <h1>404: Staff page not found</h1>
        </Route>
        </Switch>
        </>
    )
}

export default Staff;