import { Delete } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridRenderCellParams,
    GridToolbar,
    GridValueFormatterParams,
} from '@mui/x-data-grid';
import React, { FC, ReactElement } from 'react';

import { Discard } from '../../../models/Discard';
import { baseRequest } from '../../../services/api/genericRequest';
import { IStaffChild } from '../Staff';
import DiscardAddForm from '../subcomponents/DiscardAddForm';

interface DiscardsProps extends IStaffChild {
    
};

const Discards: FC<DiscardsProps> = (props: DiscardsProps): ReactElement => {

    const [addDialogOpen, setAddDialogOpen] = React.useState(false);
    const [rows, setRows] = React.useState<Discard[]>([]);
    const [currentWidth, setCurrentWidth] = React.useState(0);

    const handleAddDialogOpen = () => {
        setAddDialogOpen(true);
    };

    const handleAddDialogClose = () => {
        setAddDialogOpen(false);
        getDiscards();
    };

    const handleDiscardDelete = async (id: string) => {
        try {
            await baseRequest.delete(`/discards/${id}`);
            getDiscards();
        } catch (error) {
            
        }
    };

    const getDiscards = async () => {
        try {
            let res = await baseRequest.get<Discard[]>('/discards');
            setRows(res.data);
            setCurrentWidth(1 - currentWidth);
        } catch (error) {
            
        }
    };

    React.useEffect(() => {
        getDiscards();
    }, []);
    
    const columns: GridColDef[] = React.useMemo(
        () => [
            {
                field: 'id',
                flex: 0.6,
                headerName: 'Discard ID',
                headerAlign: 'left',
                align: 'left',
            },
            {
                field: 'weight',
                flex: 0.2,
                headerName: 'Weight (lb)',
                headerAlign: 'center',
                align: 'center',
                valueFormatter: (params: GridValueFormatterParams) => {
                    let weightVal = params.value ? (params.value as number).toFixed(2) : '-';
                    return `${weightVal} lbs`;
                },
            },
            {
                field: 'discardedAt',
                flex: 0.4,
                headerName: 'Discarded On',
                headerAlign: 'center',
                align: 'center',
                valueFormatter: (params: GridValueFormatterParams) => {
                    return new Date(params.value as string).toDateString();
                },
            },
            {
                field: 'remove',
                flex: 0.1,
                headerName: 'Remove',
                headerAlign: 'center',
                align: 'center',
                renderCell: (params: GridRenderCellParams) => (
                    <IconButton
                    onClick={() => handleDiscardDelete(params.row.id)}
                    >
                        <Delete />
                    </IconButton>
                ),
                disableExport: true,
            }
        ], []);

    return (
        <>
        <Button variant="contained" onClick={handleAddDialogOpen} color="primary">Add Discard Entry</Button>
        <div style={{height: 800, width: `100% - ${currentWidth}px`}}>
            <DataGrid
            columns={columns}
            rows={rows}
            components={{
                Toolbar: GridToolbar
            }}
            />
        </div>
        <DiscardAddForm open={addDialogOpen} onClose={handleAddDialogClose} />
        </>
    )
};

export default Discards;
