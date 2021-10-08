import React, { FC, ReactElement, useState } from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps}
    from 'react-router-dom';
import { Box, Paper, Grid, Button, TextField, Typography,
        styled, Stack, Divider, useTheme, Link, AppBar, IconButton,
        Dialog, DialogActions, DialogContent, DialogTitle,
     } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowData, GridToolbar, GridValueFormatterParams} from '@mui/x-data-grid';
import { Visibility } from '@mui/icons-material';
import PickupViewTable from '../../components/common/PickupViewTable';
import { PickupStatus } from '../../models/Pickup';

type StudentRequestTableProps = {

}

const initialRows = [
    {
        id: '123456',
        itemCount: 4,
        status: PickupStatus.WAITING,
        submittedAt: Date(),
        active: true
    },
    {
        id: '123343',
        itemCount: 12,
        status: PickupStatus.DISBURSED,
        submittedAt: Date(),
        active: false,
    },
]

const StudentRequestTable: FC<StudentRequestTableProps> = (props: StudentRequestTableProps): ReactElement => {

    const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
    const [selectedRow, setSelectedRow] = React.useState<GridRowData>();

    const handleViewDialogOpen = (row: GridRowData) => {
        setSelectedRow(row);
        setViewDialogOpen(true);
    };

    const handleViewDialogClose = () => {
        setSelectedRow(undefined);
        setViewDialogOpen(false);
    };

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
            flex: 0.5,
            headerName: 'Order ID',
        },
        {
            field: 'itemCount',
            flex: 0.3,
            headerName: '# Items Requested',
        },
        {
            field: 'status',
            flex: 0.5,
            headerName: 'Status',
            valueGetter: (params: GridValueFormatterParams) => {
                return getStatusString(params.value as PickupStatus);
            },
        },
        {
            field: 'submittedAt',
            flex: 1.5,
            headerName: 'Submit Time',
            type: 'dateTime'
        },
        {
            field: 'active',
            flex: 0.4,
            headerName: 'Active?',
            type: 'boolean'
        },
        {
            field: 'view',
            flex: 0.4,
            headerName: 'View Details',
            renderCell: (params: GridRenderCellParams) => (
                <IconButton
                onClick={() => handleViewDialogOpen(params.row)}
                >
                    <Visibility />
                </IconButton>
            ),
            headerAlign: 'center',
            align: 'center',
            disableExport: true,
        }
    ], []);

    const [rows, setRows] = React.useState(initialRows);

    return (
        <>
        <div style={{height: 300, width: '100%'}}>
            <DataGrid
            columns={columns}
            rows={rows}
            components={{
                Toolbar: GridToolbar,
            }}
            />
        </div>

        <Dialog
        open={viewDialogOpen}
        onClose={handleViewDialogClose}
        maxWidth="lg"
        fullWidth
        >
            <DialogTitle>View Details</DialogTitle>
            <DialogContent>
                <PickupViewTable id={selectedRow?.id} />
            </DialogContent>
            <DialogActions sx={{margin: 1}}>
                <Button variant="outlined" onClick={handleViewDialogClose} color="primary">Close</Button>
            </DialogActions>
        </Dialog>
        </>
    )
}

export default StudentRequestTable;