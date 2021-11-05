import { Dialog, DialogContent,DialogActions, DialogTitle,
    Paper, TableBody, TableContainer, TableHead, TableRow, Tooltip,Typography, Button } from '@mui/material';
import React, { FC, ReactElement, useState } from 'react';
import TableCell from '@mui/material/TableCell';
import Table from '@mui/material/Table';
import { baseRequest } from '../../../services/api/genericRequest';
import {TrendReport} from '../../../models/TrendReport'

const TrendReportTest: TrendReport = {
    entries: [
        {
            item: {
            id:'123',
            name:'milk',
            category:{
                id:'11',
                name:'milk',
                limit: 0,
                icon:'',
                description:'',
                visible:true,
                createdAt:''
            },
            categoryId:'',
            description:'',
            visible: true,
            createdAt:'',
        },
        requestCount:10,
        }
    ]
}

type TrendReportDialogProps = {
    open: boolean;
    onClose: () => void;
}
const TrendReportDialog: FC<TrendReportDialogProps> = (props:TrendReportDialogProps) : ReactElement => {
    const [trendReport, setTotalReport] = useState<TrendReport>();
    const getTotalReport = async () => {
        let res = await baseRequest.get<TrendReport> ('/trendReport');
        setTotalReport(res.data);
    };
    React.useEffect(() => {
        getTotalReport();

    }, [])



    return(
        <>
        <div>
        <Dialog
        open={props.open}
        onClose={props.onClose}
        >
            <DialogTitle>TrendReport</DialogTitle>
            <DialogContent>
                <TableContainer component={Paper}>
                    <Table sx = {{ maxWidth: 400, maxHeight: 600, alignItems: 'left'}} aria-label="trend report">
                        <TableHead sx={{alignItems: 'center'}}>
                            <TableRow sx={{alignItems: 'right'}}>
                                <TableCell> Item Name </TableCell>
                                <TableCell> Category </TableCell>
                                <TableCell> Count </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {TrendReportTest?.entries.map((row) => (
                                <TableRow
                                key={row.item.id}
                                >
                                <TableCell align="center">{row.item.name} </TableCell>
                                <TableCell align="center">{row.item.category?.name} </TableCell>
                                <TableCell align="center">{row.requestCount} </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions sx={{margin: 1}}>
            <Button variant="outlined" onClick={props.onClose} color="secondary">Closed</Button>
            </DialogActions>
        </Dialog>
        </div>
        </>
    )
};
export default TrendReportDialog;