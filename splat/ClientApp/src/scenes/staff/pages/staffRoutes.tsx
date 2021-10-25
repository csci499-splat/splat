import {
    AccessTime,
    Assessment,
    Category,
    FormatListBulleted,
    Home as HomeIcon,
    ListAlt,
    MonetizationOn,
    People,
    DeleteForever,
} from '@mui/icons-material';
import React from 'react';

import Categories from './Categories';
import Donations from './Donations';
import Home from './Home';
import Hours from './Hours';
import Items from './Items';
import Pickups from './Pickups';
import Reports from './Reports';
import Users from './Users';
import Discards from './Discards';
import History from './History';

export type StaffRoute = {
    url: string;
    name: {
        abbv: string;
        full: string;
    };
    icon: React.ReactElement,
    page: React.ReactElement,
    adminOnly?: boolean,
};

const staffRoutes: StaffRoute[] = [
    {
        url: '/staff/home',
        name: {
            abbv: 'Home',
            full: 'Staff Home'
        },
        icon: <HomeIcon />,
        page: <Home />
    },
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
        url: '/staff/hours',
        name: {
            abbv: 'Hours',
            full: 'Adjust Pantry Hours'
        },
        icon: <AccessTime />,
        page: <Hours />
    },
    {
        url: '/staff/users',
        name: {
            abbv: 'Users',
            full: 'Manage System Users',
        },
        icon: <People />,
        page: <Users />,
        adminOnly: true,
    },
    {
        url: '/staff/discards',
        name: {
            abbv: 'Discards',
            full: 'Discard unused items by weight',
        },
        icon: <DeleteForever />,
        page: <Discards />,
    },
    {
        url: '/staff/history',
        name: {
            abbv: 'History',
            full: 'View Pickups History',
        },
        icon: <FormatListBulleted />,
        page: <History />,
    }
];

export { staffRoutes };
