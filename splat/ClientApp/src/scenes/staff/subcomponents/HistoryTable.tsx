import { Delete, Edit } from '@mui/icons-material';
import { Dialog, DialogTitle, IconButton, Tooltip } from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridRenderCellParams,
    GridRowData,
    GridToolbar,
    GridValueFormatterParams,
    GridValueGetterParams
} from '@mui/x-data-grid';
import { type } from 'os';
import React, { FC, ReactElement, useState } from 'react';

import { Category } from '../../../models/Category';
import { CategoryIcons } from '../../../models/CategoryIcons';
import { baseRequest } from '../../../services/api/genericRequest';
import CategoriesEditDialog from './CategoriesEditDialog';
import { History, HistoryStatus } from '../../../models/History';


type HistoryTableProps = {
    open : boolean;
    onClose : () => void;
};

const HistoryTable: FC<HistoryTableProps> = (props: HistoryTableProps) : ReactElement => {

    const [historyTable, setHistoryTable] = useState<History[]>([]);
    const getHistoryTable = async () => {
        let res = await baseRequest.get<History[]> ('/history');
        setHistoryTable(res.data);
    };

    React.useEffect(() => {
        getHistoryTable();
    },[])

    const getStatusString = (status: HistoryStatus): string => {
        switch(status) {
            case HistoryStatus.PENDING:
                return "Pending fulfillment";
            case HistoryStatus.WAITING:
                return "Waiting for pickup";
            case HistoryStatus.DISBURSED:
                return "Disbursed to student";
            case HistoryStatus.CANCELED:
                return "Canceled";
            default:
                return "None";
        }
    };

    const columns: GridColDef[] = React.useMemo(
        () => [
            {
                field: 'id',
                flex: 0.6,
                headerName: 'Pickup ID',
                headerAlign: 'center',
                align: 'center',
            },
            {
                field: 'numberOfItems',
                flex: 0.2,
                headerName: '# Items',
                headerAlign: 'center',
                align: 'center',
                valueGetter: (params: GridValueGetterParams) => {
                    return params.row.itemRequests.length;
                }
            },
            {
                field: 'requestedPickupTime',
                flex: .9,
                headerName: 'Requested Pickup Time',
                type: 'dateTime',
                headerAlign: 'center',
                align: 'center',
            },
            {
                field: 'studentID',
                flex: 0.6,
                headerName: 'Student ID',
                headerAlign: 'center',
                align: 'center',
                valueGetter: (params: GridValueGetterParams) => {
                    return params.row.studentInfo.studentId;
                }
            },
            {
                field: 'status',
                flex: .4,
                headerName: 'Status',
                valueGetter: (params: GridValueGetterParams) => {
                    return getStatusString(params.row.pickupStatus as HistoryStatus);
                },
                headerAlign: 'center',
                align: 'center',
            },
            {
                field: 'viewMore',
                flex: 0.2,
                headerName: 'View Details',
                /*renderCell: (params: GridRenderCellParams) => (
                    <IconButton
                    onClick={() => handleDialogOpen('viewDetails', params.row as IPickupRow)}
                    >
                        <Visibility />
                    </IconButton>
                ),*/
                headerAlign: 'center',
                align: 'center',
                disableExport: true,
            },
        ], []);
    
        
    return(
        <>
        <Dialog
        open={props.open}
        onClose={props.onClose}
        >
            <DialogTitle></DialogTitle>
        </Dialog>
        </>
    )
}