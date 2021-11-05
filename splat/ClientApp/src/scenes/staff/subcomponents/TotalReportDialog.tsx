import { Dialog, DialogContent, DialogActions, DialogTitle, Paper, 
    Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import React, { FC, ReactElement, useState } from 'react';
import { baseRequest } from '../../../services/api/genericRequest';
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
                                <TableCell> {TotalReportTest.foodWeight} </TableCell>                       
                            </TableRow>
                            
                            <TableRow>
                                <TableCell> Food Disbursements: </TableCell>
                                <TableCell> {TotalReportTest.disbursements} </TableCell>
                                
                            </TableRow>

                            <TableRow>
                            <TableCell> People Impacted: </TableCell>
                            <TableCell> {TotalReportTest.peopleImpacted} </TableCell>
                            </TableRow>
                            
                            <TableRow>
                                <TableCell>Recurring Visits: </TableCell>
                                <TableCell> {TotalReportTest.recurringVisits} </TableCell>
                            </TableRow>
                            
                            <TableRow>
                                <TableCell> Individual Visits: </TableCell>
                                <TableCell> {TotalReportTest.individualVisits} </TableCell>
                            
                            </TableRow>
                    </TableBody>
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