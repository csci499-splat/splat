import React, { FC, ReactElement, useState } from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps}
    from 'react-router-dom';
import { Box, Paper, Grid, Button, TextField, Typography,
        styled, Stack, Divider, useTheme, Link, AppBar } from '@mui/material';

type StaffProps = {

}

const Staff: FC<StaffProps> = (props: StaffProps): ReactElement => {

    

    return (
        <>
            <h2>
                Staff landing page
            </h2>
        </>
    )
}

export default Staff;