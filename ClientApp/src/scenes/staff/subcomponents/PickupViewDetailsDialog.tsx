import React, { FC, ReactElement } from 'react';
import { IPickupRow, IPickupDialogProps } from '../pages/Pickups';
import * as yup from 'yup';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button,
     } from '@mui/material';

interface PickupViewDetailsDialogProps extends IPickupDialogProps {
    
};

const PickupViewDetailsDialog: FC<PickupViewDetailsDialogProps> = (props: PickupViewDetailsDialogProps): ReactElement => {


    return (
        <>
        <Dialog 
        open={props.open} 
        onClose={props.onClose}
        maxWidth="lg" 
        fullWidth
        >
            <DialogTitle>View Details</DialogTitle>
            <DialogContent>
                <h3>{JSON.stringify(props.selectedPickup)}</h3>
            </DialogContent>
            <DialogActions sx={{margin: 1}}>
                <Button variant="outlined" onClick={props.onClose} color="primary">Close</Button>
            </DialogActions>
        </Dialog>
        </>
    )
};

export default PickupViewDetailsDialog;
