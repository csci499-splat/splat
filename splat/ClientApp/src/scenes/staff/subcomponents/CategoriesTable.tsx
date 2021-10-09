import React, { FC, ReactElement, useState } from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps}
    from 'react-router-dom';
import { Box, Paper, Grid, Button, TextField, Typography,
        styled, Stack, Divider, useTheme, Link, AppBar, BottomNavigation, IconButton, Tooltip,
     } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowData, 
    GridRowsProp, GridToolbar, GridValueFormatterParams, GridValueGetterParams, GridToolbarContainer, useGridApiRef, } 
    from '@mui/x-data-grid';
import { Delete, Edit, PanoramaSharp } from '@mui/icons-material';
import { Category } from '../../../models/Category';
import { Item } from '../../../models/Item';
import { baseRequest } from '../../../services/api/genericRequest';
import CategoriesEditDialog from './CategoriesEditDialog';
import { CategoryIcons } from '../../../models/CategoryIcons';

type CategoriesTableProps = {
    
}

const CategoriesTable: FC<CategoriesTableProps> = (props: CategoriesTableProps) : ReactElement => {

    const [editCategoryOpen, setEditCategoryOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<GridRowData>();
    const [categories, setCategories] = useState<Category[]>([]);
    const [currentWidth, setCurrentWidth] = useState(0);

    const handleOpenEditCategory = (row: GridRowData) => {
        setEditCategoryOpen(true);
        setSelectedRow(row);
    };

    const handleCloseEditCategory = () => {
        setEditCategoryOpen(false);
        setSelectedRow(undefined);
        getCategories();
    };

    const handleDeleteCategory = async (row: GridRowData) => {
        await baseRequest.delete(`/categories/${row.id}`);
        getCategories();
    };

    const getCategories = async () => {
        let res = await baseRequest.get<Category[]>('/categories');
        setCategories(res.data);
        setCurrentWidth(1 - currentWidth);
    };

    React.useEffect(() => {
        getCategories();
    }, []);

    const columns: GridColDef[] = React.useMemo(
        () => [
            {
                field: 'id',
                flex: 0.3,
                headerName: 'Item ID',
                align: 'left',
                headerAlign: 'left',
            },
            {
                field: 'name',
                flex: 0.6,
                headerName: 'Name',
                align: 'center',
                headerAlign: 'center',
            },
            {
                field: 'limit',
                flex: 0.1,
                headerName: 'Limit',
                align: 'center',
                headerAlign: 'center',
                renderCell: (params: GridRenderCellParams) => {
                    return (
                        <Tooltip
                            title="The maximum number of items that can be requested for each item in this category"
                        >
                            <div>{params.row.limit}</div>
                        </Tooltip>
                    )
                },
            },
            {
                field: 'description',
                flex: 0.7,
                headerName: 'Description',
                align: 'center',
                headerAlign: 'center',
            },
            {
                field: 'visible',
                flex: 0.2,
                headerName: 'Visible?',
                type: 'boolean',
                align: 'center',
                headerAlign: 'center',
            },
            {
                field: 'createdAt',
                flex: 0.5,
                headerName: 'Created At',
                align: 'center',
                headerAlign: 'center',
                valueFormatter: (params: GridValueFormatterParams) => {
                    return new Date(params.value as string).toLocaleString();
                },
            },
            {
                field: 'icon',
                flex: 0.1,
                headerName: 'Icon',
                align: 'center',
                headerAlign: 'center',
                renderCell: (params: GridRenderCellParams) => {
                    return CategoryIcons[params.row.icon];
                },
            },
            {
                field: 'edit',
                flex: 0.1,
                headerName:'Edit',
                align: 'center',
                headerAlign: 'center',
                renderCell: (params: GridRenderCellParams) => {
                    return (
                        <IconButton
                        onClick={() => handleOpenEditCategory(params.row)}                       
                        >
                            <Edit />
                        </IconButton>
                        
                    )
                },
                disableExport: true,
            },
            {
                field: 'remove',
                flex: 0.15,
                headerName:'Remove',
                align: 'center',
                headerAlign: 'center',
                renderCell: (params: GridRenderCellParams) => {
                    return (
                        <IconButton
                        onClick={() => handleDeleteCategory(params.row)}                       
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
        <div style={{height: 750, width: `100% - ${currentWidth}px`}}>
            <DataGrid
            columns={columns}
            rows={categories}
            components={{
                Toolbar: GridToolbar
            }}
            />
        </div>
        <CategoriesEditDialog
        onClose={handleCloseEditCategory}
        category={selectedRow}
        open={editCategoryOpen}
        />
        </>
    )
}

export default CategoriesTable;
