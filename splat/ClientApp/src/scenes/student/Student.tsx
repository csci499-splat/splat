import { Button } from '@mui/material';
import React, { FC, ReactElement, useState } from 'react';

import RequestForm from './RequestForm';
import StudentRequestTable from './StudentRequestTable';

type StudentProps = {

}

const Student: FC<StudentProps> = (props: StudentProps): ReactElement => {

    const [requestFormOpen, setRequestFormOpen] = React.useState(false);
    
    const handleShowRequestForm = () => {
        setRequestFormOpen(true);
    }

    return (
        <>
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