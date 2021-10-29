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
import {TotalReport} from '../../../models/TotalReport';

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
            <DialogTitle>TotalReport</DialogTitle>
            <DialogContent>
            <div>
            <FormControl>
                <Typography>FoodWeight: {totalReport?.foodWeight} </Typography>
                <Typography>Disbursements: {totalReport?.disbursements}</Typography>
                <Typography>People Impacted: {totalReport?.peopleImpacted} </Typography>
                <Typography>Recurring Visits: {totalReport?.recurringVisits}</Typography>
                <Typography>Individual Visits: {totalReport?.individualVisits}</Typography>
            </FormControl>
        </div>
            </DialogContent>
        </Dialog>
        
        </>
    )
};

export default TotalReportDialog; 