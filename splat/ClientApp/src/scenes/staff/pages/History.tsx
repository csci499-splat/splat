import { CancelOutlined, Done, Outbound, Visibility } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
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
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDateRangePicker from '@mui/lab/MobileDateRangePicker';
import { History } from '../../../models/History';


interface HistoryProps extends IStaffChild {
    
}

export interface IHistoryRow extends GridRowData, Pickup {
    
};

export interface IHistoryDialogProps {
    selectedPickup?: IHistoryRow;
    open: boolean;
    onClose: () => void;
};

const History: FC<HistoryProps> = (props: HistoryProps): ReactElement => {

    return (
        <>
        <h1>{props.pageName}</h1>
        </>
    )
};

export default History;