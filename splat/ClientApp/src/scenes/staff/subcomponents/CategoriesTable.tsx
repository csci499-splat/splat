import { Delete, Edit } from '@mui/icons-material';
import { Button, IconButton, Stack, Tooltip } from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridRenderCellParams,
    GridRowData,
    GridToolbar,
    GridValueFormatterParams,
    gridClasses,
    GridToolbarContainer,
    GridToolbarExport,
    GridToolbarDensitySelector,
    GridToolbarFilterButton,
} from '@mui/x-data-grid';
import { useTheme } from '@mui/styles';
import axios from 'axios';
import React, { FC, ReactElement, useState } from 'react';

import { Category } from '../../../models/Category';
import { CategoryIcons } from '../../../models/CategoryIcons';
import CategoriesAddDialog from './CategoriesAddDialog';
import CategoriesEditDialog from './CategoriesEditDialog';
import FileUploader from '../../../components/common/FileUploader';

type CategoriesTableProps = {
    
}

function CustomToolbar() {
    return (
        <GridToolbarContainer className={gridClasses.toolbarContainer}>
            <GridToolbarExport csvOptions={{ 
                fields: ['id', 'name', 'limit', 'description', 'visible', 'createdAt', 'icon'],
                fileName: `splat-categories-${new Date().getTime()}` }} />
            <GridToolbarDensitySelector />
            <GridToolbarFilterButton />
        </GridToolbarContainer>
    );
}

const CategoriesTable: FC<CategoriesTableProps> = (props: CategoriesTableProps) : ReactElement => {

    const [addCategoriesOpen, setAddCategoriesOpen] = React.useState(false);
    const [editCategoryOpen, setEditCategoryOpen] = useState(false);

    const [selectedRow, setSelectedRow] = useState<GridRowData>();
    const [categories, setCategories] = useState<Category[]>([]);
    const [currentWidth, setCurrentWidth] = useState(0);

    const handleOpenAddCategories = () => {
        setAddCategoriesOpen(true);
    };

    const handleCloseAddCategories = () => {
        setAddCategoriesOpen(false);
        getCategories();
    };

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
        await axios.delete(`/categories/${row.id}`);
        getCategories();
    };

    const getCategories = async () => {
        let res = await axios.get<Category[]>('/categories/all');
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
                        <Tooltip title="WARNING! Removing a category will also delete ALL associated items!">
                        <IconButton
                        onClick={() => handleDeleteCategory(params.row)}              
                        >
                            <Delete />
                        </IconButton>
                        </Tooltip>
                    )
                },
                disableExport: true,
            },
        ],[]);

    const theme = useTheme();
        
    return (
        <>
        <Stack 
        direction="row" 
        alignItems="center" 
        justifyContent="center" 
        spacing={2} 
        sx={{ margin: 2, width: "100%" }}>
            <Button
            variant="contained"
            onClick={handleOpenAddCategories}
            sx={{ height: 40 }}
            >
                Create Category
            </Button>
            <FileUploader
            fileUploadEndpoint="/categories/upload"
            fileMimeType="text/csv"
            acceptType=".csv"
            promptText="Select a CSV file for categories"
            sx={{ marginTop: '10px' }}
            onFileUploaded={() => getCategories()}
            />
        </Stack>
        
        <div style={{height: 'calc(100vh - 275px)', width: `100% - ${currentWidth}px`}}>
            <DataGrid
            columns={columns}
            rows={categories}
            components={{
                Toolbar: CustomToolbar,
            }}
            />
        </div>
        <CategoriesEditDialog
        onClose={handleCloseEditCategory}
        category={selectedRow}
        open={editCategoryOpen}
        />
        <CategoriesAddDialog
        onClose={() => handleCloseAddCategories()}
        open={addCategoriesOpen}
        />
        </>
    )
}

export default CategoriesTable;
