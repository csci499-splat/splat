import React, { FC, ReactElement } from 'react';
import { Pickup } from '../../../models/BackendTypes';
import { IPickupRow, IPickupDialogProps } from '../pages/Pickups';
import * as yup from 'yup';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography,
    } from '@mui/material';
import { baseRequest } from '../../../services/api/genericRequest';
import { PickupStatus } from '../../../models/Pickup';

interface PickupCancelConfirmationDialogProps extends IPickupDialogProps {
    
};

const PickupCancelConfirmationDialog: FC<PickupCancelConfirmationDialogProps> = (props: PickupCancelConfirmationDialogProps): ReactElement => {

    const handleCancel = async (id: string | undefined | null) => {
        if(id) await baseRequest.patch(`/pickups/${id}`, { status: PickupStatus.CANCELED });
        props.onClose();
    };

    return (
        <>
        <Dialog 
        open={props.open} 
        onClose={props.onClose}
        >
            <DialogTitle>Cancel Pickup</DialogTitle>
            <DialogContent>
                <Typography variant="h5">
                    Are you sure you want to cancel this pickup?
                </Typography>
            </DialogContent>
            <DialogActions sx={{margin: 1}}>
                <Button variant="outlined" onClick={props.onClose} color="primary">Close</Button>
                <Button variant="contained" onClick={() => handleCancel(props.selectedPickup?.id)} color="error">
                    Cancel It
                </Button>
            </DialogActions>
        </Dialog>
        </>
    )

};

export default PickupCancelConfirmationDialog;
