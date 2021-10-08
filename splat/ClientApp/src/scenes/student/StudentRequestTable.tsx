import React, { FC, ReactElement, useState } from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps}
    from 'react-router-dom';
import { Box, Paper, Grid, Button, TextField, Typography,
        styled, Stack, Divider, useTheme, Link, AppBar,
     } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar} from '@mui/x-data-grid';

type StudentRequestTableProps = {

}

const initialRows = [
    {
        id: '123456',
        itemCount: 4,
        status: 'WAITING',
        submittedAt: Date(),
        active: true
    },
    {
        id: '123343',
        itemCount: 12,
        status: 'CANCELED',
        submittedAt: Date(),
        active: false,
    },
]

const StudentRequestTable: FC<StudentRequestTableProps> = (props: StudentRequestTableProps): ReactElement => {

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
        </>
    )
}

export default StudentRequestTable;