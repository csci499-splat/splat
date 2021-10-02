import React, { FC, ReactElement, useState } from 'react';
import { Link, LinkProps as RouterLinkProps, Route, Switch, MemoryRouter,
    useRouteMatch } from 'react-router-dom';
import { Box, Paper, Grid, Button, TextField, Typography,
        styled, Stack, Divider, useTheme, AppBar, Tabs, Tab } from '@mui/material';
import { staffRoutes, StaffRoute } from './pages/staffRoutes';

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
            { staffRoutes.map((value: StaffRoute, index) => (
            <Tab label={value.name.abbv} value={value.url} to={value.url} component={Link} icon={value.icon} />
            ))}
        </Tabs>
        </Box>
        <Switch>
        { staffRoutes.map((value: StaffRoute, index) => (
            <Route exact path={value.url} render={(props) => React.cloneElement(value.page, {...props, pageName: value.name.full})} />
        ))}
        <Route path='/'>
            <h1>404: Staff page not found</h1>
        </Route>
        </Switch>
        </>
    )
}

export default Staff;