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
import { PickupStatus, getStatusString } from '../../../models/Pickup';

interface PickupProps extends IStaffChild {
    
}

const Pickups: FC<PickupProps> = (props: PickupProps): ReactElement => {

    const columns: GridColDef[] = React.useMemo(
        () => [
            {
                field: 'id',
                flex: 0.6,
                headerName: 'Pickup ID'
            },
            {
                field: 'numberOfItems',
                flex: 0.2,
                headerName: '# Items'
            },
            {
                field: 'requestedPickupTime',
                flex: .9,
                headerName: 'Requested Pickup Time',
                type: 'dateTime'
            },
            {
                field: 'studentID',
                flex: 0.6,
                headerName: 'Student ID'
            },
            {
                field: 'status',
                flex: .4,
                headerName: 'Status',
                valueFormatter: (params: GridValueFormatterParams) =>
                    getStatusString(params.value as PickupStatus)
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
                )
            },
            {
                field: 'pickupStatus',
                flex: 0.2,
                headerName: 'Action',
                renderCell: (params: GridRenderCellParams) => (
                    <Tooltip
                    title={params.value == PickupStatus.PENDING ? 
                        'Fulfill request' : 'Picked up by student'}
                    >
                    <IconButton
                    onClick={() => {}}
                    >
                        {params.value == PickupStatus.PENDING &&
                            <Done />
                        }
                        {params.value == PickupStatus.WAITING &&
                            <Outbound />
                        }
                    </IconButton>
                    </Tooltip>
                )
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
                )
            },
        ], []);

    return (
        <>
        <h1>{props.pageName}</h1>
        <div style={{height: 600, width: '100%'}}>
            <DataGrid
            columns={columns}
            rows={[]}
            components={{
                Toolbar: GridToolbar
            }}
            />
        </div>
        </>
    )
};

export default Pickups;
