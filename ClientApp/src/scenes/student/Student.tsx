import React, { FC, ReactElement, useState } from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps}
    from 'react-router-dom';
import { Box, Paper, Grid, Button, TextField, Typography,
        styled, Stack, Divider, useTheme, Link, AppBar } from '@mui/material';

type StudentProps = {

}

const Student: FC<StudentProps> = (props: StudentProps): ReactElement => {

    

    return (
        <>
            <h2>
                Make your requests here!
            </h2>
        </>
    )
}

export default Student;