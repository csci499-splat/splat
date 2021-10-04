import React, { FC, ReactElement } from 'react';
import { Box, Grid, Divider, Button, Dialog, DialogContent, 
        DialogActions, DialogTitle, IconButton, Tooltip }
    from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar, GridValueFormatterParams }
    from '@mui/x-data-grid';
import { Edit, Delete, Add, CancelOutlined, Visibility, Done, Outbound } 
    from '@mui/icons-material';
import { IStaffChild } from '../Staff';
import { Pickup } from '../../../models/BackendTypes';
import { PickupStatus } from '../../../models/Pickup';

interface PickupProps extends IStaffChild {
    
}

const Pickups: FC<PickupProps> = (props: PickupProps): ReactElement => {

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
                    onClick={() => {}}
                    >
                        <Visibility />
                    </IconButton>
                ),
                headerAlign: 'center',
                align: 'center',
            },
            {
                field: 'pickupStatus',
                flex: 0.2,
                headerName: 'Action',
                renderCell: (params: GridRenderCellParams) => {
                    console.log(params);
                    return (
                    <Tooltip
                    title={params.row.status == "PENDING" ? 
                        'Fulfill request' : 'Picked up by student'}
                    >
                    <IconButton
                    onClick={() => {}}
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
            },
            {
                field: 'cancel',
                flex: 0.2,
                headerName: 'Cancel',
                renderCell: (params: GridRenderCellParams) => (
                    <IconButton
                    onClick={() => {}}
                    >
                        <CancelOutlined />
                    </IconButton>
                ),
                headerAlign: 'center',
                align: 'center',
            },
        ], []);

    return (
        <>
        <div style={{height: 600, width: '100%'}}>
            <DataGrid
            columns={columns}
            rows={[{
                id: 'hhdf-dsjfd-ffd23-fd54',
                numberOfItems: 10,
                requestedPickupTime: new Date(),
                studentID: '1234567',
                status: PickupStatus.WAITING,
            }]}
            components={{
                Toolbar: GridToolbar
            }}
            />
        </div>
        </>
    )
};

export default Pickups;
