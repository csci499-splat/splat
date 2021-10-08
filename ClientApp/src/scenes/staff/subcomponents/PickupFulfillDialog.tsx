import React, { FC, ReactElement } from 'react';
import { Pickup } from '../../../models/BackendTypes';
import { PickupStatus } from '../../../models/Pickup';
import { IPickupRow, IPickupDialogProps } from '../pages/Pickups';
import * as yup from 'yup';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button,
    Typography, } from '@mui/material';
import PickupViewTable from '../../../components/common/PickupViewTable';

interface PickupFulfillDialogProps extends IPickupDialogProps {

};

const PickupFulfillDialog: FC<PickupFulfillDialogProps> = (props: PickupFulfillDialogProps): ReactElement => {


    return (
        <>
        <Dialog 
        open={props.open} 
        onClose={props.onClose}
        maxWidth="lg"
        fullWidth
        >
        {props.selectedPickup?.status === PickupStatus.PENDING ? (
            <>
            <DialogTitle>
                Fulfill Request
            </DialogTitle>
            <DialogContent>
                <PickupViewTable id={props.selectedPickup.id} showCheckboxes={true} />
            </DialogContent>
            <DialogActions sx={{margin: 1}}>
                <Button variant="outlined" onClick={props.onClose} color="primary">Cancel</Button>
                <Button variant="contained" onClick={() => {alert(`Fulfilling request ${props.selectedPickup?.id}`); props.onClose();}} color="primary">
                    Fulfill
                </Button>
            </DialogActions>
            </>
        ) : (
            <>
            <DialogTitle>
                Student Picked Up
            </DialogTitle>
            <DialogContent>
                <Typography variant="h5">
                    Has the student picked up the order?
                </Typography>
            </DialogContent>
            <DialogActions sx={{margin: 1}}>
                <Button variant="outlined" onClick={props.onClose} color="primary">Cancel</Button>
                <Button variant="contained" onClick={() => {alert(`Picked up ${props.selectedPickup?.id}`); props.onClose();}} color="success">
                    Confirm Picked Up
                </Button>
            </DialogActions>
            </>
        )}
        </Dialog>
        </>
    )

};

export default PickupFulfillDialog;
