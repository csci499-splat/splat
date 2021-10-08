import React, { FC, ReactElement, useState } from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps}
    from 'react-router-dom';
import { Box, Paper, Grid, Button, TextField, Typography,
        styled, Stack, Divider, useTheme, Link, AppBar, BottomNavigation, IconButton,
     } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowData, GridToolbar, GridValueFormatterParams} from '@mui/x-data-grid';
import EditItem from './EditItems';
import { Edit, PanoramaSharp } from '@mui/icons-material';
import Items from '../Items';
import EditItems from './EditItems';


type ItemsTableProps = {
    
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
                flex:0.5,
                headerName: 'Name'
            },
            {
                field: 'category',
                flex:0.5,
                headerName: 'Category'
            },
            {
                field: 'description',
                flex:0.5,
                headerName: 'Description'
            },
            {
                field: 'visible',
                flex:0.5,
                headerName: 'Visible?',
                type:'boolean'
            },
            {
                field: 'createdAt',
                flex:0.5,
                headerName: 'Create At',
                type: 'dateTime',
                valueFormatter: (params: GridValueFormatterParams) => {
                    const valueFormatted = String(
                        (params.value as Date)
                    ).toLocaleString();
                    return `${valueFormatted}`;
                }
            },
            {
                field: 'edit',
                flex: 0.2,
                headerName:'Edit',
                type:'boolean',
                renderCell: (params:GridRenderCellParams) => {
                    return(
                        <IconButton
                        onClick={() => handleShowEditItem(params.row ) }                       
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
        <EditItems
         onClose={() => handleCloseEditItem()}
         item={selectedRow}
         open={editItemOpen}
        />
        </>
    )
}

export default ItemsTable;