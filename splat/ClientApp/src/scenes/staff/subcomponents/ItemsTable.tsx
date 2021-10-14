import React, { FC, ReactElement, useState } from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps}
    from 'react-router-dom';
import { Box, Paper, Grid, Button, TextField, Typography,
        styled, Stack, Divider, useTheme, Link, AppBar, BottomNavigation, IconButton,
     } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowData, 
    GridRowsProp, GridToolbar, GridValueFormatterParams, GridValueGetterParams} 
    from '@mui/x-data-grid';
import { Delete, Edit, PanoramaSharp } from '@mui/icons-material';
import { Category } from '../../../models/Category';
import ItemsEditDialog from './ItemsEditDialog';
import { Item } from '../../../models/Item';
import { baseRequest } from '../../../services/api/genericRequest';


type ItemsTableProps = {
    
}

const ItemsTable: FC<ItemsTableProps> = (props: ItemsTableProps) : ReactElement => {

    const [editItemOpen, setEditItemOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<GridRowData>();
    const [items, setItems] = useState<Item[]>([]);
    const [currentWidth, setCurrentWidth] = useState(0);

    const handleShowEditItem = (row: GridRowData) => {
        setEditItemOpen(true);
        setSelectedRow(row);
    };

    const handleCloseEditItem = () => {
        setEditItemOpen(false);
        setSelectedRow(undefined);
        getItems();
    };

    const handleDeleteItem = async (row: GridRowData)  => {
        await baseRequest.delete(`/items/${row.id}`);
        getItems();
        setCurrentWidth(1 - currentWidth);
    };

    const getItems = async () => {
        let res = await baseRequest.get<Item[]>('/items');
        setItems(res.data);
        setCurrentWidth(1 - currentWidth);
    };

    React.useEffect(() => {
        getItems();
    }, [])

    const columns: GridColDef[] = React.useMemo(
        () => [
            {
                field: 'id',
                flex: 0.5,
                headerName: 'Item ID',
                align: 'left',
                headerAlign: 'left',
            },
            {
                field: 'name',
                flex: 0.5,
                headerName: 'Name',
                align: 'center',
                headerAlign: 'center',
            },
            {
                field: 'category',
                flex: 0.5,
                headerName: 'Category',
                align: 'center',
                headerAlign: 'center',
                valueGetter: (params: GridValueGetterParams) => {
                    return `${params.row.category.name}`;
                },
            },
            {
                field: 'description',
                flex: 0.5,
                headerName: 'Description',
                align: 'center',
                headerAlign: 'center',
            },
            {
                field: 'visible',
                flex: 0.5,
                headerName: 'Visible?',
                align: 'center',
                headerAlign: 'center',
                type: 'boolean',
            },
            {
                field: 'createdAt',
                flex: 0.5,
                headerName: 'Created At',
                align: 'center',
                headerAlign: 'center',
                valueFormatter: (params: GridValueFormatterParams) => {
                    return new Date(params.value as string).toLocaleString();
                }
            },
            {
                field: 'edit',
                flex: 0.2,
                headerName:'Edit',
                align: 'center',
                headerAlign: 'center',
                renderCell: (params: GridRenderCellParams) => {
                    return (
                        <IconButton
                        onClick={() => handleShowEditItem(params.row)}                       
                        >
                            <Edit />
                        </IconButton>
                    )
                },
                disableExport: true,
            },
            {
                field: 'remove',
                flex: 0.2,
                headerName:'Remove',
                align: 'center',
                headerAlign: 'center',
                renderCell: (params: GridRenderCellParams) => {
                    return (
                        <IconButton
                        onClick={() => handleDeleteItem(params.row)}              
                        >
                            <Delete />
                        </IconButton>
                    )
                },
                disableExport: true,
            },
        ],[]);
        
    return (
        <>
        <div style={{ height: 750, width: `100% - ${currentWidth}px`}}>
            <DataGrid
            columns={columns}
            rows={items}
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
