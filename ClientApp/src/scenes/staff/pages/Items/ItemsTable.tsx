import React, { FC, ReactElement, useState } from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps}
    from 'react-router-dom';
import { Box, Paper, Grid, Button, TextField, Typography,
        styled, Stack, Divider, useTheme, Link, AppBar,
     } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar} from '@mui/x-data-grid';

type ItemTableProps = {

}

const initialRows = [
    {
        id: '123456',
        name: 'Milk',
        category: 1,
        description: 'white milk',
        visible: true,
        createdAt: Date()
    },
    {
        id: '123321',
        name: 'Water',
        category: 2,
        description: 'Aquafina',
        visible: false,
        createdAt: Date()
    },
]

const ItemTable: FC<ItemTableProps> = (props: ItemTableProps) : ReactElement => {

    const columns: GridColDef[] = React.useMemo(
        () => [
            {
                field: 'id',
                flex:0.5,
                headerName: 'Item ID',1
            },
            {
                
            }
        ],[]
    );
}