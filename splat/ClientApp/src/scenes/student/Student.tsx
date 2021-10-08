import React, { FC, ReactElement, useState } from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps}
    from 'react-router-dom';
import { Box, Paper, Grid, Button, TextField, Typography,
        styled, Stack, Divider, useTheme, Link, AppBar,
     } from '@mui/material';
import StudentRequestTable from './StudentRequestTable';
import RequestForm from './RequestForm';

type StudentProps = {

}

const Student: FC<StudentProps> = (props: StudentProps): ReactElement => {

    const [requestFormOpen, setRequestFormOpen] = React.useState(false);
    
    const handleShowRequestForm = () => {
        setRequestFormOpen(true);
    }

    return (
        <>
            <h2>
                Make your requests here!
            </h2>
            <Button
            variant="contained"
            onClick={handleShowRequestForm}
            >New Request</Button>
            {requestFormOpen && (
                <RequestForm 
                onClose={() => setRequestFormOpen(false)}
                />
            )}
            <StudentRequestTable />
        </>
    )
}

export default Student;