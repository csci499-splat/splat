import { Dialog, DialogContent, DialogActions, DialogTitle, Paper, FormControl, IconButton, Tooltip,Typography, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import React, { FC, ReactElement, useState } from 'react';
import { Pickup } from '../../../models/BackendTypes';
import { PickupStatus } from '../../../models/Pickup';
import { baseRequest } from '../../../services/api/genericRequest';
import { IStaffChild } from '../Staff';
import {TotalReport} from '../../../models/TotalReport';

const TotalReportTest: TotalReport = {
    foodWeight:200,
    disbursements:20,
    peopleImpacted:22,
    recurringVisits:300,
    individualVisits:30,
}

type TotalReportDialogProps = {
    open: boolean;
    onClose: () => void;

}
const TotalReportDialog: FC<TotalReportDialogProps> = (props:TotalReportDialogProps) : ReactElement => {

    const [totalReport, setTotalReport] = useState<TotalReport>();
    const getTotalReport = async () => {
        let res = await baseRequest.get<TotalReport> ('/totalReport');
        setTotalReport(res.data);
    };

    React.useEffect(() => {
        getTotalReport();

    }, [])

    

    return(
        <>
        <Dialog
        open={props.open}
        onClose={props.onClose}
        >
            <DialogTitle>Total Report</DialogTitle>
            <DialogContent>
            <div>
            <TableContainer component={Paper}>
                    <Table sx = {{ maxWidth: 400, maxHeight: 600, alignItems: 'left'}} aria-label="trend report">
                        <TableHead sx={{alignItems: 'center'}}>
                            <TableRow sx={{alignItems: 'right'}}>
                                <TableCell> Total Food Weight </TableCell>
                                <TableCell> Total Food Disbursements </TableCell>
                                <TableCell> Total People Impacted </TableCell>
                                <TableCell> Total Recurring Visits </TableCell>
                                <TableCell> Total Individual Visits </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {TotalReportTest?.map((row) => (
                                <TableRow
                                key={row.totalReport.foodWeight}
                                >
                                <TableCell align="center">{row.item.name} </TableCell>
                                <TableCell align="center">{row.item.category?.name} </TableCell>
                                <TableCell align="center">{row.requestCount} </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
        </div>
            </DialogContent>
            <DialogActions sx={{margin: 1}}>
            <Button variant="outlined" onClick={props.onClose} color="secondary">Closed</Button>
            </DialogActions>
        </Dialog>
        
        </>
    )
};

export default TotalReportDialog; 