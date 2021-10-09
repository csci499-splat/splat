import React, { FC, ReactElement, useState } from 'react';
import { Box, Grid, Divider, Button, Dialog, DialogContent, 
        DialogActions, DialogTitle, IconButton, Tooltip }
    from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar, GridValueFormatterParams,
        GridRowData, GridSortModel }
    from '@mui/x-data-grid';
import { CancelOutlined, Visibility, Done, Outbound } 
    from '@mui/icons-material';
import { IStaffChild } from '../Staff';
import { Pickup } from '../../../models/BackendTypes';
import { PickupStatus } from '../../../models/Pickup';
import PickupCancelConfirmDialog from '../subcomponents/PickupCancelConfirmDialog';
import PickupFulfillDialog from '../subcomponents/PickupFulfillDialog';
import PickupViewDetailsDialog from '../subcomponents/PickupViewDetailsDialog';
import { baseRequest } from '../../../services/api/genericRequest';

interface PickupProps extends IStaffChild {
    
}

export interface IPickupRow extends GridRowData {
    id: string;
    numberOfItems: number;
    requestedPickupTime: Date;
    studentID: string,
    status: PickupStatus,
};

const initialRows: IPickupRow[] = [
    {
        id: '2362353e-570b-477c-9c65-522c1487c848',
        numberOfItems: 10,
        requestedPickupTime: new Date(),
        studentID: '1234567',
        status: PickupStatus.WAITING,
    },
    {
        id: '7b9094c7-8092-444e-9140-2d69a3e935b6',
        numberOfItems: 2,
        requestedPickupTime: new Date(Date.now() - (6.048e+8 * 2)),
        studentID: '4573859',
        status: PickupStatus.PENDING,
    },
];

export interface IPickupDialogProps {
    selectedPickup?: IPickupRow;
    open: boolean;
    onClose: () => void;
};

const Pickups: FC<PickupProps> = (props: PickupProps): ReactElement => {

    const [dialogOpen, setDialogOpen] = useState({viewDetails: false, fulfill: false, cancelConfirmation: false});
    const [selectedPickup, setSelectedPickup] = useState<IPickupRow>();
    const [pickups, setPickups] = useState<Pickup[]>([]);
    const [currentWidth, setCurrentWidth] = useState(0);

    const [sortModel, setSortModel] = React.useState<GridSortModel>([
        {
          field: 'requestedPickupTime',
          sort: 'asc',
        },
    ]);

    const handleDialogOpen = (dialog: 'viewDetails' | 'fulfill' | 'cancelConfirmation', currentRow: GridRowData) => {
        setDialogOpen((prevState) => ({ ...prevState, [dialog]: true }));
        setSelectedPickup(currentRow as IPickupRow);
    };

    const handleDialogClose = (dialog: 'viewDetails' | 'fulfill' | 'cancelConfirmation') => {
        setDialogOpen((prevState) => ({ ...prevState, [dialog]: false }));
        setSelectedPickup(undefined);
    };

    const getPickups = async () => {
        let res = await baseRequest.get<Pickup[]>('/pickups');
        setPickups(res.data);
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
            },
            {
                field: 'status',
                flex: .4,
                headerName: 'Status',
                valueGetter: (params: GridValueFormatterParams) => {
                    return getStatusString(params.value as PickupStatus);
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
                    onClick={() => handleDialogOpen('viewDetails', params.row)}
                    >
                        <Visibility />
                    </IconButton>
                ),
                headerAlign: 'center',
                align: 'center',
                disableExport: true,
            },
            {
                field: 'pickupStatus',
                flex: 0.2,
                headerName: 'Action',
                renderCell: (params: GridRenderCellParams) => {
                    return (
                    <Tooltip
                    title={params.row.status == "PENDING" ? 
                        'Fulfill request' : 'Picked up by student'}
                    >
                    <IconButton
                    onClick={() => handleDialogOpen('fulfill', params.row)}
                    >
                        {params.row.status == PickupStatus.PENDING &&
                            <Done />
                        }
                        {params.row.status == PickupStatus.WAITING &&
                            <Outbound />
                        }
                    </IconButton>
                    </Tooltip>
                )},
                headerAlign: 'center',
                align: 'center',
                disableExport: true,
            },
            {
                field: 'cancel',
                flex: 0.2,
                headerName: 'Cancel',
                renderCell: (params: GridRenderCellParams) => (
                    <IconButton
                    onClick={() => handleDialogOpen('cancelConfirmation', params.row)}
                    >
                        <CancelOutlined />
                    </IconButton>
                ),
                headerAlign: 'center',
                align: 'center',
                disableExport: true,
            },
        ], []);

    return (
        <>
        <div style={{ height: 800, width: `100% - ${currentWidth}px`}}>
            <DataGrid
            columns={columns}
            rows={initialRows}
            components={{
                Toolbar: GridToolbar
            }}
            sortModel={sortModel}
            onSortModelChange={(model) => setSortModel(model)}
            />
        </div>
        <PickupViewDetailsDialog 
        selectedPickup={selectedPickup} 
        open={dialogOpen.viewDetails}
        onClose={() => handleDialogClose('viewDetails')}
        />
        <PickupFulfillDialog
        selectedPickup={selectedPickup}
        open={dialogOpen.fulfill}
        onClose={() => handleDialogClose('fulfill')}
        />
        <PickupCancelConfirmDialog
        selectedPickup={selectedPickup}
        open={dialogOpen.cancelConfirmation}
        onClose={() => handleDialogClose('cancelConfirmation')}
        />
        </>
    )
};

export default Pickups;
