import React, { FC, ReactElement } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar, GridRowData }
    from '@mui/x-data-grid';
import { IStaffChild } from '../Staff';
import { Delete, Edit} from '@mui/icons-material';
import { IconButton}
    from '@mui/material';


interface CategoryProps extends IStaffChild {
    
}

export interface CategoryRow extends GridRowData {
    id: string;
    name: string;
    limit: number;
    createdAt: string;
    description: string,
    visible: boolean,
    icon: string,
};

const initialRows: CategoryRow[] = [
    {
        id: '1111111111',
        name: 'Drink',
        limit: 5,
        createdAt: '12:24PM',
        description: 'Liquid products in a drinking container',
        visible: true,
        icon: ':)',
    },
    {
        id: '2222222222',
        name: 'Fruit',
        limit: 5,
        createdAt: '9:56AM',
        description: 'Natural Fruit',
        visible: true,
        icon: ':)',
    },
];

export interface Category_Props {
    selectedPickup?: CategoryRow;
    open: boolean;
    onClose: () => void;
};

const Categories: FC<CategoryProps> = (props: CategoryProps): ReactElement => {





    const columns: GridColDef[] = React.useMemo(
        () => [
            {
                field: 'id',
                editable: true,
                flex: 0.5,
                headerName: 'Category ID',
                headerAlign: 'center',
                align: 'center',
            },
            {
                field: 'name',
                editable: true,
                flex: 0.4,
                headerName: 'Name',
                headerAlign: 'center',
                align: 'center',
            },
            {
                field: 'limit',
                editable: true,
                flex: .3,
                headerName: 'Limit',
                headerAlign: 'center',
                align: 'center',
            },
            {
                field: 'createdAt',
                editable: true,
                flex: 0.3,
                headerName: 'Creation Time',
                headerAlign: 'center',
                align: 'center',
            },
            {
                field: 'description',
                editable: true,
                flex: 0.7,
                headerName: 'Description',
                headerAlign: 'center',
                align: 'center',
            },
            {
                field: 'visible',
                editable: true,
                type: 'boolean',
                flex: 0.3,
                headerName: 'Visible',
                headerAlign: 'center',
                align: 'center',
            },
            {
                field: 'icon',
                flex: 0.3,
                headerName: 'Icon',
                headerAlign: 'center',
                align: 'center',
            },
            {
                field: 'edit',
                flex: 0.2,
                headerName: 'Edit',
                headerAlign: 'center',
                align: 'center',
                renderCell: (params:GridRenderCellParams) => {
                    return(
                        <IconButton

                        >
                            <Edit/>
                        </IconButton>
                    )
                }
            },
            {
                field: 'delete',
                flex: 0.2,
                headerName: 'Delete',
                headerAlign: 'center',
                align: 'center',
                renderCell: (params:GridRenderCellParams) => {
                    return(
                        <IconButton
                       //onClick={() =>         }
                        >
                            <Delete />
                        </IconButton>
                        
                    )
                }
                
            },




        ], []);



    

    return (
        <>
        <div style={{height: 500, width: '100%'}}>
            <DataGrid
            columns={columns}
            rows={initialRows}
            components={{
                Toolbar: GridToolbar
            }}


            />
        </div>       
        </>
    )
};

export default Categories;