import React from 'react';
import { Assessment, Category, FormatListBulleted, Home as HomeIcon, ListAlt, MonetizationOn } from '@mui/icons-material';
import Home from './Home';
import Pickups from './Pickups';
import Categories from './Categories';
import Items from './Items';
import Donations from './Donations';
import Reports from './Reports';

export type StaffRoute = {
    url: string;
    name: {
        abbv: string;
        full: string;
    };
    icon: React.ReactElement,
    page: React.ReactElement,
};

const staffRoutes: StaffRoute[] = [
    {
        url: '/staff/pickups',
        name: {
            abbv: 'Pickups',
            full: 'View/Manage Pickups'
        },
        icon: <ListAlt />,
        page: <Pickups />
    },
    {
        url: '/staff/categories',
        name: {
            abbv: 'Categories',
            full: 'Manage Categories'
        },
        icon: <Category />,
        page: <Categories />
    },
    {
        url: '/staff/items',
        name: {
            abbv: 'Items',
            full: 'Manage Items'
        },
        icon: <FormatListBulleted />,
        page: <Items />
    },
    {
        url: '/staff/donations',
        name: {
            abbv: 'Donations',
            full: 'View/Add Donations'
        },
        icon: <MonetizationOn />,
        page: <Donations />
    },
    {
        url: '/staff/reports',
        name: {
            abbv: 'Reports',
            full: 'View Reports'
        },
        icon: <Assessment />,
        page: <Reports />
    },
    {
        url: '/staff',
        name: {
            abbv: 'Home',
            full: 'Staff Home'
        },
        icon: <HomeIcon />,
        page: <Home />
    },
];

export { staffRoutes };
