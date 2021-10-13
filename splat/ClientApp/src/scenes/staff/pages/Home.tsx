import { TextField, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import React, { FC, ReactElement } from 'react';
import { StaffMessage } from '../../../models/StaffMessage';
import { baseRequest } from '../../../services/api/genericRequest';
import { IStaffChild } from '../Staff';

interface HomeProps extends IStaffChild {
    
}

const Home: FC<HomeProps> = (props: HomeProps): ReactElement => {

    const [currentMessage, setCurrentMessage] = React.useState<string | null>();
    
    const getCurrentMessage = async () => {
        let res = await baseRequest.get<StaffMessage>('/staffmessages');
        setCurrentMessage(res.data.message);
    };

    const handleUpdateMessage = async () => {
        await baseRequest.post<StaffMessage>('/staffmessages', {
            message: currentMessage,
        });
    };

    React.useEffect(() => {
        getCurrentMessage();
    }, []);

    return (
        <>
        <TextField
        label="Landing page message"
        value={currentMessage}
        onChange={(newValue) => setCurrentMessage(newValue.target.value)}
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
