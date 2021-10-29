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
            <DialogTitle>TotalReport</DialogTitle>
            <DialogContent>
            <div>
            <Typography>FoodWeight: {TotalReportTest?.foodWeight} </Typography>
            <Typography>Disbursements: {TotalReportTest?.disbursements}</Typography>
            <Typography>People Impacted: {TotalReportTest?.peopleImpacted} </Typography>
            <Typography>Recurring Visits: {TotalReportTest?.recurringVisits}</Typography>
            <Typography>Individual Visits: {TotalReportTest?.individualVisits}</Typography>
        </div>
            </DialogContent>
        </Dialog>
        
        </>
    )
};

export default TotalReportDialog; 