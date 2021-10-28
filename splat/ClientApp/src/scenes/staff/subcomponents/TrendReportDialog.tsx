import { CancelOutlined, Done, Outbound, Visibility } from '@mui/icons-material';
import { Dialog, DialogContent, DialogTitle, FormControl, IconButton, Tooltip,Typography } from '@mui/material';
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
    const [totalReport, setTotalReport] = useState<TrendReport[]>([]);
    const getTotalReport = async () => {
        let res = await baseRequest.get<TrendReport[]> ('/trendReport');
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
            <DialogTitle>TrendReport</DialogTitle>
            <DialogContent>
                <div>
                    
                </div>
            </DialogContent>
        </Dialog>
        </>
    )
};