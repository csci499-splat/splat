import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import axios from 'axios';
import React, { FC, ReactElement } from 'react';

import { PickupStatus } from '../../../models/Pickup';
import { IPickupDialogProps } from '../pages/Pickups';

interface PickupCancelConfirmationDialogProps extends IPickupDialogProps {
    
};

const PickupCancelConfirmationDialog: FC<PickupCancelConfirmationDialogProps> = (props: PickupCancelConfirmationDialogProps): ReactElement => {

    const handleCancel = async (id: string | undefined | null) => {
        if(id)
        try {
            await axios.patch(`/pickups/${props.selectedPickup?.id}`,
                [
                    {
                        op: "add",
                        path: "/pickupstatus",
                        value: PickupStatus.CANCELED,
                    },
                    {
                        op: "add",
                        path: "/canceledtime",
                        value: new Date().toISOString(),
                    }
                ]);
        } catch (err) {

        };
        
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
