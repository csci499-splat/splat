import { CancelOutlined, Done, Outbound, RowingSharp, Visibility } from '@mui/icons-material';
import { Dialog, DialogContent, DialogTitle, FormControl, IconButton, Paper, TableBody, TableContainer, TableHead, TableRow, Tooltip,Typography } from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridRenderCellParams,
    GridRowData,
    GridSortModel,
    GridToolbar,
    GridValueGetterParams,
} from '@mui/x-data-grid';
import React, { FC, ReactElement, useState } from 'react';
import TableCell from '@mui/material/TableCell';
import Table from '@mui/material/Table';
import { Pickup } from '../../../models/BackendTypes';
import { PickupStatus } from '../../../models/Pickup';
import { baseRequest } from '../../../services/api/genericRequest';
import { IStaffChild } from '../Staff';
import {TrendReport} from '../../../models/TrendReport'
import { propsToClassKey } from '@mui/styles';
import ItemAutocomplete from '../../student/ItemAutocomplete';

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
    const [currentWidth, setCurrentWidth] = useState(0);

    React.useEffect(() => {
        getTotalReport();

    }, [])



    return(
        <>
        <div>
        <Dialog
        open={props.open}
        onClose={props.onClose}
        maxWidth= 'xl'
        fullWidth
        >
            <DialogTitle>TrendReport</DialogTitle>
            <DialogContent>
                <TableContainer component={Paper}>
                    <Table sx = {{ maxWidth: 650, maxHeight: 600}} aria-label="trend report">
                        <TableHead>
                            <TableRow>
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
                                <TableCell align="left">{row.item.name} </TableCell>
                                <TableCell align="left">{row.item.category?.name} </TableCell>
                                <TableCell align="left">{row.requestCount} </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
        </Dialog>
        </div>
        </>
    )
};
export default TrendReportDialog;