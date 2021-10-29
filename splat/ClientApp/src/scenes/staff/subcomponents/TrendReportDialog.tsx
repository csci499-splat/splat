import { CancelOutlined, Done, Outbound, Visibility } from '@mui/icons-material';
import { Dialog, DialogContent, DialogTitle, FormControl, IconButton, Paper, TableContainer, Tooltip,Typography } from '@mui/material';
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
import Table from '@mui/material/Table';
import { Pickup } from '../../../models/BackendTypes';
import { PickupStatus } from '../../../models/Pickup';
import { baseRequest } from '../../../services/api/genericRequest';
import { IStaffChild } from '../Staff';
import {TrendReport} from '../../../models/TrendReport'
import { propsToClassKey } from '@mui/styles';


type TrendReportDialogProps = {
    open: boolean;
    onClose: () => void;
}
const TrendReportDialog: FC<TrendReportDialogProps> = (props:TrendReportDialogProps) : ReactElement => {
    const [trendReport, setTotalReport] = useState<TrendReport[]>([]);
    const getTotalReport = async () => {
        let res = await baseRequest.get<TrendReport[]> ('/trendReport');
        setTotalReport(res.data);
        setCurrentWidth(1 - currentWidth);
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

                    </Table>
                </TableContainer>
            </DialogContent>
        </Dialog>
        </div>
        
        </>
    )
};

export default TrendReportDialog;