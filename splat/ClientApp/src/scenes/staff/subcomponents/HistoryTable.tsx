import { Delete, Edit } from '@mui/icons-material';
import { CancelOutlined, Done, Outbound, Visibility } from '@mui/icons-material';
import { Dialog, DialogTitle, IconButton, Tooltip } from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridRenderCellParams,
    GridRowData,
    GridToolbar,
    GridSortModel,
    GridValueFormatterParams,
    GridValueGetterParams
} from '@mui/x-data-grid';
import { type } from 'os';
import React, { FC, ReactElement, useState } from 'react';

import { baseRequest } from '../../../services/api/genericRequest';
import { History, PickupStatus } from '../../../models/History';
import HistoryViewDetailsDialog from '../subcomponents/HistoryViewDetailsDialog';


type HistoryTableProps = {
    open : boolean;
    onClose : () => void;
};

export interface IHistoryRow extends GridRowData, History {
    
};

export interface IHistoryDialogProps {
    selectedPickup?: IHistoryRow;
    open: boolean;
    onClose: () => void;
};



const HistoryTable: FC<HistoryTableProps> = (props: HistoryTableProps) : ReactElement => {

    const [dialogOpen, setDialogOpen] = useState({viewDetails: false});
    const [selectedPickup, setSelectedPickup] = useState<IHistoryRow>();
    const [historyTable, setHistoryTable] = useState<History[]>([]);
    const [currentWidth, setCurrentWidth] = useState(0);

    const [sortModel, setSortModel] = React.useState<GridSortModel>([
        {
          field: 'requestedPickupTime',
          sort: 'asc',
        },
    ]);

    const getHistoryTable = async () => {
        let res = await baseRequest.get<History[]> ('/history');
        setHistoryTable(res.data);
    };

    React.useEffect(() => {
        getHistoryTable();
    },[])

    const handleDialogOpen = (dialog: 'viewDetails', currentRow: IHistoryRow) => {
        setDialogOpen((prevState) => ({ ...prevState, [dialog]: true }));
        setSelectedPickup(currentRow);
    };

    const handleDialogClose = (dialog: 'viewDetails') => {
        setDialogOpen((prevState) => ({ ...prevState, [dialog]: false }));
        setSelectedPickup(undefined);
        getPickups();
    };

    const getPickups = async () => {
        let res = await baseRequest.get<History[]>('/history');
        setHistoryTable(res.data);
        setCurrentWidth(1 - currentWidth);
    }

    const getStatusString = (status: PickupStatus): string => {
        switch(status) {
            case PickupStatus.PENDING:
                return "Pending fulfillment";
            case PickupStatus.WAITING:
                return "Waiting for pickup";
            case PickupStatus.DISBURSED:
                return "Disbursed to student";
            case PickupStatus.CANCELED:
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
                    return getStatusString(params.row.pickupStatus as PickupStatus);
                },
                headerAlign: 'center',
                align: 'center',
            },
            {
                field: 'viewMore',
                flex: 0.2,
                headerName: 'View Details',
                renderCell: (params: GridRenderCellParams) => (
                    <IconButton
                    onClick={() => handleDialogOpen('viewDetails', params.row as IHistoryRow)}
                    >
                        <Visibility />
                    </IconButton>
                ),
                headerAlign: 'center',
                align: 'center',
                disableExport: true,
            },
        ], []);
    
        
    return(
        <>
        <div style={{ height: 'calc(100vh - 210px)', width: `100% - ${currentWidth}px`}}>
            <DataGrid
            columns={columns}
            rows={historyTable}
            components={{
                Toolbar: GridToolbar
            }}
            sortModel={sortModel}
            onSortModelChange={(model) => setSortModel(model)}
            />
        </div>
        <HistoryViewDetailsDialog 
        selectedPickup={selectedPickup} 
        open={dialogOpen.viewDetails}
        onClose={() => handleDialogClose('viewDetails')}
        />
        </>
    )
}