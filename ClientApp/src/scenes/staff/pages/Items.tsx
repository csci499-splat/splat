import React, { FC, ReactElement, useState } from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps}
    from 'react-router-dom';
import { Box, Paper, Grid, Button, TextField, Typography,
        styled, Stack, Divider, useTheme, Link, AppBar,
     } from '@mui/material';
import { IStaffChild } from '../Staff';

interface ItemProps extends IStaffChild {
    
}

const Items: FC<ItemProps> = (props: ItemProps): ReactElement => {



    return (
        <>
        <h1>{props.pageName}</h1>
        </>
    )
};

export default Items;
