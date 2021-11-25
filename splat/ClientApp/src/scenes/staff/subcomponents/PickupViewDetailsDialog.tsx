import { Check, KeyboardArrowDown } from '@mui/icons-material';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Collapse,
} from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';
import React, { FC, ReactElement } from 'react';

import { Pickup } from '../../../models/BackendTypes';
import { PickupStatus } from '../../../models/Pickup';
import { IPickupDialogProps } from '../pages/Pickups';
import axios from 'axios';

interface PickupViewDetailsDialogProps extends IPickupDialogProps {
    
};

const PickupViewDetailsDialog: FC<PickupViewDetailsDialogProps> = (props: PickupViewDetailsDialogProps): ReactElement => {

    const pickupData = props.selectedPickup;

    const getStatusString = (status: PickupStatus): string => {
        switch(status) {
            case PickupStatus.PENDING:
                return "Pending fulfillment";
            case PickupStatus.WAITING:
                return "Waiting for pickup";
            case PickupStatus.DISBURSED:
                return "Disbursed to student";
            case PickupStatus.CANCELED:
                return "Canceled";
            default:
                return "None";
        }
    };

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
            {pickupData !== undefined ? (
            <TableContainer>
            <Table sx={{ minWidth: 650 }} >
                <TableHead>
                    <TableRow>
                        <TableCell align="left">Pickup ID</TableCell>
                        <TableCell align="center"># Items</TableCell>
                        <TableCell align="center">Requested Pickup Time</TableCell>
                        <TableCell align="center">Student ID</TableCell>
                        <TableCell align="center">Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell align="left">{pickupData.id}</TableCell>
                        <TableCell align="center">{pickupData.itemRequests.length}</TableCell>
                        <TableCell align="center">{pickupData.requestedPickupTime.toLocaleString()}</TableCell>
                        <TableCell align="center">{pickupData.studentInfo.studentId}</TableCell>
                        <TableCell align="center">{getStatusString(pickupData.pickupStatus)}</TableCell>
                    </TableRow>
                <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Typography variant="h6" align="center" sx={{ marginTop: 2 }}>
                        Student information
                    </Typography>
                    <Table size="small" sx={{marginBottom: 2}}>
                        <TableHead>
                            <TableCell align="left">Student Age</TableCell>
                            {pickupData.householdInfo && (
                                <>
                                <TableCell align="center"># Seniors</TableCell>
                                <TableCell align="center"># Adults</TableCell>
                                <TableCell align="center"># Minors</TableCell>
                                </>
                            )}
                            <TableCell align="right">On Meal Plan?</TableCell>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell align="left">{pickupData.studentInfo.age}</TableCell>
                                {pickupData.householdInfo && (
                                    <>
                                    <TableCell align="center">{pickupData.householdInfo?.numSeniors}</TableCell>
                                    <TableCell align="center">{pickupData.householdInfo?.numAdults}</TableCell>
                                    <TableCell align="center">{pickupData.householdInfo?.numMinors}</TableCell>
                                    </>
                                )}
                                <TableCell align="right">{pickupData.studentInfo.onMealPlan ? "Yes" : "No"}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Typography variant="h6" align="center">
                        Pickup weight and times
                    </Typography>
                    <Table size="small" sx={{marginBottom: 2}}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Submit Time</TableCell>
                                {Boolean(pickupData.canceledTime) || Boolean(pickupData.pickupTime) && (
                                    <TableCell align="center">{pickupData.pickupTime ? "Pickup Time" : "Cancel Time"}</TableCell>
                                )}
                                <TableCell align="center">Weight</TableCell>
                                <TableCell align="center">Notes</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell align="left">{pickupData.submittedAt?.toLocaleString()}</TableCell>
                                {Boolean(pickupData.canceledTime) || Boolean(pickupData.pickupTime) && (
                                    <TableCell align="center">{pickupData.pickupTime ? pickupData.pickupTime?.toLocaleString() : 
                                        pickupData.canceledTime?.toLocaleString()}
                                    </TableCell>
                                )}
                                
                                <TableCell align="center">{pickupData.weight ? (pickupData.weight?.toFixed(2) + ' lbs') :
                                    'N/A'}</TableCell>
                                <TableCell align="center">{pickupData.otherNotes}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Typography variant="h6" align="center">
                        Items requested
                    </Typography>
                    <Table size="small" sx={{marginBottom: 2}}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Item Category</TableCell>
                                <TableCell align="center">Item Name</TableCell>
                                <TableCell align="right">Quantity</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pickupData.itemRequests.map((item, index: number) => (
                                <TableRow key={index}>
                                    <TableCell align="left">{item.item.category?.name}</TableCell>
                                    <TableCell align="center">{item.item.name}</TableCell>
                                    <TableCell align="right">{item.quantity}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableCell>
            </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
            ) : (
                <>
                <h4>Loading...</h4>
                <CircularProgress />
                </>
            )}
            </DialogContent>
            <DialogActions sx={{margin: 1}}>
                <Button variant="outlined" onClick={props.onClose} color="primary">Close</Button>
            </DialogActions>
        </Dialog>
        </>
    )
};

export default PickupViewDetailsDialog;
