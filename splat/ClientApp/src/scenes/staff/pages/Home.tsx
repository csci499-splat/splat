import { Add } from '@mui/icons-material';
import { Button, TextField } from '@mui/material';
import React, { FC, ReactElement } from 'react';

import { StaffMessage } from '../../../models/StaffMessage';
import { authRequest } from '../../../services/api/genericRequest';
import { IStaffChild } from '../Staff';

interface HomeProps extends IStaffChild {
    
}

const Home: FC<HomeProps> = (props: HomeProps): ReactElement => {

    const [currentMessage, setCurrentMessage] = React.useState<string | null>();
    
    const getCurrentMessage = async () => {
        let res = await authRequest.get<StaffMessage>('/staffmessages');
        setCurrentMessage(res.data.message);
    };

    const handleUpdateMessage = async () => {
        await authRequest.post<StaffMessage>('/staffmessages', {
            message: currentMessage,
        });
    };

    React.useEffect(() => {
        getCurrentMessage();
    }, []);

    return (
        <>
        <TextField
        value={currentMessage}
        onChange={(newValue) => setCurrentMessage(newValue.target.value)}
        label=""
        variant="standard"
        />
        <Button
        onClick={() => handleUpdateMessage()}
        startIcon={<Add />}
        >
            Update the landing page message
        </Button>
        </>
    )
};

export default Home;
