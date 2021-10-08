import React, { FC, ReactElement } from 'react';
import { Pickup } from '../../../models/BackendTypes';
import { IPickupRow, IPickupDialogProps } from '../pages/Pickups';
import * as yup from 'yup';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography,
    } from '@mui/material';
import { requestAuth } from '../../../services/api/genericRequest';

interface PickupCancelConfirmationDialogProps extends IPickupDialogProps {
    
};

const PickupCancelConfirmationDialog: FC<PickupCancelConfirmationDialogProps> = (props: PickupCancelConfirmationDialogProps): ReactElement => {

    const handleCancel = async () => {
        alert(`Canceling ${props.selectedPickup?.id}`);
        await requestAuth(`/pickups/${props.selectedPickup?.id}`, 'DELETE');
        props.onClose();
    };

    return (
        <>
        <Dialog 
        open={props.open} 
        onClose={props.onClose}
        fullWidth
        >
            <DialogTitle>Cancel Pickup</DialogTitle>
            <DialogContent>
                <Typography variant="h5">
                    Are you sure you want to cancel this pickup?
                </Typography>
            </DialogContent>
            <DialogActions sx={{margin: 1}}>
                <Button variant="outlined" onClick={props.onClose} color="primary">Close</Button>
                <Button variant="contained" onClick={() => handleCancel()} color="error">
                    Cancel It
                </Button>
            </DialogActions>
        </Dialog>
        </>
    )

};

export default PickupCancelConfirmationDialog;
