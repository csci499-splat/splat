import React, { FC, ReactElement } from 'react';
import { Add, Clear } from '@mui/icons-material';
import { Button, TextField, IconButton, InputAdornment, Stack } from '@mui/material';
import { authRequest, baseRequest } from '../../../services/api/genericRequest';
import { StaffMessage } from '../../../models/StaffMessage';
import axios from 'axios';

type SetCurrentMessageProps = {

};

const SetCurrentMessage: FC<SetCurrentMessageProps> = (props: SetCurrentMessageProps): ReactElement => {


    const [currentMessage, setCurrentMessage] = React.useState<string | null>('');
    const [originalMessage, setOriginalMessage] = React.useState<string | null>('');
    
    const getCurrentMessage = async () => {
        try {
            let res = await baseRequest.get<StaffMessage>('/staffmessages');
            setCurrentMessage(res.data.message);
            setOriginalMessage(res.data.message);
        } catch(err) {

        }
    };

    const handleUpdateMessage = async () => {
        try {
            await axios.post<StaffMessage>('/staffmessages', {
                message: currentMessage,
            });
            setOriginalMessage(currentMessage);
        } catch(err) {

        }
    };

    React.useEffect(() => {
        getCurrentMessage();
    }, []);

    return (
        <div style={{ position: 'relative', height: '72%' }}>
        <TextField
        value={currentMessage}
        onChange={(newValue) => setCurrentMessage(newValue.target.value)}
        label="Message"
        variant="standard"
        multiline
        maxRows={5}
        sx={{width: '100%'}}
        InputProps={{
            endAdornment: (
                <InputAdornment position="end">
                    <IconButton
                    onClick={() => setCurrentMessage('')}
                    onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault()}
                    size="small"
                    >
                        {<Clear />}
                    </IconButton>
                </InputAdornment>
            )
        }}
        />
        { currentMessage !== originalMessage && (
            <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: '100%', right: 0 }}>
                <Button
                onClick={() => setCurrentMessage(originalMessage)}
                variant="outlined"
                >
                    Cancel
                </Button>
                <Button
                onClick={() => handleUpdateMessage()}
                startIcon={<Add />}
                variant="contained"
                >
                        Update
                </Button>
            </Stack>
        )}
        </div>
    )
};

export default SetCurrentMessage;