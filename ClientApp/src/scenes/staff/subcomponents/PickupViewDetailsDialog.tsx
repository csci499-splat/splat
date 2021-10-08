import React, { FC, ReactElement } from 'react';
import { IPickupRow, IPickupDialogProps } from '../pages/Pickups';
import * as yup from 'yup';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button,
    Table, TableBody, TableCell, TableContainer, TableRow, TableHead,
    Collapse, IconButton, Typography, Paper, Box, CircularProgress } from '@mui/material';
import { Check, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { fetchResourceAuth } from '../../../services/api/genericRequest';
import { Pickup } from '../../../models/BackendTypes';
import { PickupStatus } from '../../../models/Pickup';
import PickupViewTable from '../../../components/common/PickupViewTable';

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
                <PickupViewTable id={props.selectedPickup?.id} />
            </DialogContent>
            <DialogActions sx={{margin: 1}}>
                <Button variant="outlined" onClick={props.onClose} color="primary">Close</Button>
            </DialogActions>
        </Dialog>
        </>
    )
};

export default PickupViewDetailsDialog;
