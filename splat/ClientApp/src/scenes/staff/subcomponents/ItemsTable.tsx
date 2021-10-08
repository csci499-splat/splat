import React, { FC, ReactElement, useState } from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps}
    from 'react-router-dom';
import { Box, Paper, Grid, Button, TextField, Typography,
        styled, Stack, Divider, useTheme, Link, AppBar, BottomNavigation, IconButton,
     } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowData, 
    GridRowsProp, GridToolbar, GridValueFormatterParams, GridValueGetterParams} 
    from '@mui/x-data-grid';
import { Edit, PanoramaSharp } from '@mui/icons-material';
import { Category } from '../../../models/Category';
import ItemsEditDialog from './ItemsEditDialog';
import { Item } from '../../../models/Item';


type ItemsTableProps = {
    
}

const initialRows: GridRowsProp = [
    {
        id: '123456',
        name: 'Milk',
        category: {
            id: '123456',
            name: 'milk',
            limit:'3',
            icon:'4',
            description: 'milk',
            visible: true,
            createdAt: Date()
        },
        description: 'white milk',
        visible: true,
        createdAt: Date()
    },
    {
        id: '123321',
        name: 'Water',
        category: {
            id: '123321',
            name: 'water',
            limit:'5',
            icon:'5',
            description: 'water',
            visible: false,
            createdAt: Date()
        },
        description: 'Aquafina',
        visible: false,
        createdAt: Date()
    },
]

const ItemsTable: FC<ItemsTableProps> = (props: ItemsTableProps) : ReactElement => {

    const [editItemOpen, setEditItemOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<GridRowData>();

    const handleShowEditItem = (row: GridRowData) => {
        setEditItemOpen(true);
        setSelectedRow(row);
        console.log(row);
    }
    const handleCloseEditItem = () => {
        setEditItemOpen(false);
        setSelectedRow(undefined);
    }

    const columns: GridColDef[] = React.useMemo(
        () => [
            {
                field: 'id',
                flex: 0.5,
                headerName: 'Item ID',
            },
            {
                field: 'name',
                flex: 0.5,
                headerName: 'Name'
            },
            {
                field: 'category',
                flex: 0.5,
                headerName: 'Category',
                valueGetter: (params: GridValueGetterParams) => {
                    return `${params.row.category.name}`;
                }
            },
            {
                field: 'description',
                flex: 0.5,
                headerName: 'Description'
            },
            {
                field: 'visible',
                flex: 0.5,
                headerName: 'Visible?',
                type: 'boolean'
            },
            {
                field: 'createdAt',
                flex: 0.5,
                headerName: 'Created At',
                valueFormatter: (params: GridValueFormatterParams) => {
                    return new Date(params.value as string).toLocaleString();
                }
            },
            {
                field: 'edit',
                flex: 0.2,
                headerName:'Edit',
                renderCell: (params: GridRenderCellParams) => {
                    return(
                        <IconButton
                        onClick={() => handleShowEditItem(params.row)}                       
                        >
                            <Edit />
                        </IconButton>
                        
                    )
                }
            }

        ],[]);

        const [rows,setRows] = React.useState(initialRows)
        

    return(
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
        <ItemsEditDialog
        onClose={handleCloseEditItem}
        item={selectedRow}
        open={editItemOpen}
        />
        </>
    )
}

export default ItemsTable;
