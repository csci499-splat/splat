import { Dialog, DialogContent, DialogActions, DialogTitle, Paper, 
    Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@mui/material';
import React, { FC, ReactElement, useState } from 'react';
import {TotalReport} from '../../../models/TotalReport';
import axios from 'axios';
import {ReportDialogProps} from '../pages/Reports';

interface TotalReportDialogProps extends ReportDialogProps {

}
const TotalReportDialog: FC<TotalReportDialogProps> = (props:TotalReportDialogProps) : ReactElement => {

    const [totalReport, setTotalReport] = useState<TotalReport>();

    const getTotalReport = async () => {
        try {
            let res = await axios.get<TotalReport> ('/totalReports', {
                params: {
                    // @ts-ignore
                    dateFrom: props.startDateValue.toISOString(),
                    // @ts-ignore
                    dateTo: props.endDateValue.toISOString(),
                }
            });
            setTotalReport(res.data);
        } catch(err) {

        }
    };

    React.useEffect(() => {
        if(props.open)
            getTotalReport();
    }, [props.open]);

        return(
            <>
            <Dialog
            open={props.open}
            onClose={props.onClose}
            >
                <DialogTitle>Total Report</DialogTitle>
                <DialogContent>
                { totalReport !== undefined ? (
                <div>
                    <TableContainer component={Paper}>
                    <Table sx = {{ maxWidth: 700, maxHeight: 600, alignItems: 'left'}} aria-label="total report">
                        <TableHead >
                            <TableRow >
                                <TableCell align="left">Total</TableCell>
                                <TableCell align="right">Count</TableCell>
                            </TableRow>
                        </TableHead>
                        
                    </Table>
                    <TableBody>
                    <TableRow sx={{alignItems: 'right'}}>
                                <TableCell> Food Weight:</TableCell>
                                <TableCell> {totalReport?.foodWeight} </TableCell>                       
                            </TableRow>
                            
                            <TableRow>
                                <TableCell> Food Disbursements: </TableCell>
                                <TableCell> {totalReport?.disbursements} </TableCell>
                                
                            </TableRow>

                            <TableRow>
                            <TableCell> People Impacted: </TableCell>
                            <TableCell> {totalReport?.peopleImpacted} </TableCell>
                            </TableRow>
                            
                            <TableRow>
                                <TableCell>Recurring Visits: </TableCell>
                                <TableCell> {totalReport?.recurringVisits} </TableCell>
                            </TableRow>
                            
                            <TableRow>
                                <TableCell> Individual Visits: </TableCell>
                                <TableCell> {totalReport?.individualVisits} </TableCell>
                            
                            </TableRow>
                    </TableBody>
                </TableContainer>
            </div>
                ) : (
                    <Typography variant="h5">
                        Loading...
                    </Typography>
                )}
                </DialogContent>
                <DialogActions sx={{margin: 1}}>
                <Button variant="outlined" onClick={props.onClose} color="secondary">Close</Button>
                </DialogActions>
            </Dialog>
            
            </>
        )
};

export default TotalReportDialog; 