import React, { FC, ReactElement } from 'react';
import { IStaffChild } from '../Staff';
import { Box, Grid, Divider, Button, IconButton, Tooltip }
    from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar, GridValueFormatterParams,
    GridRowData, GridSortModel }
    from '@mui/x-data-grid';
import { Delete, Add } 
    from '@mui/icons-material';
import { Donation } from '../../../models/Donation';
import { baseRequest } from '../../../services/api/genericRequest';
import DonationAddForm from '../subcomponents/DonationAddForm';

interface DonationProps extends IStaffChild {
    
};

interface IDonationRow extends GridRowData {
    id: string;
    monetaryValue?: number;
    weight?: number;
    donor: string;
    donatedAt: string;
};

const Donations: FC<DonationProps> = (props: DonationProps): ReactElement => {

    const [addDialogOpen, setAddDialogOpen] = React.useState(false);
    const [rows, setRows] = React.useState<Donation[]>([]);
    const [currentWidth, setCurrentWidth] = React.useState(0);

    const handleAddDialogOpen = () => {
        setAddDialogOpen(true);
    };

    const handleAddDialogClose = () => {
        setAddDialogOpen(false);
        getDonations();
    };

    const handleDonationDelete = async (id: string) => {
        let res = await baseRequest.delete(`/donations/${id}`);
        getDonations();
    };

    const getDonations = async () => {
        let res = await baseRequest.get<Donation[]>('/donations');
        setRows(res.data);
        setCurrentWidth(1 - currentWidth);
    };

    React.useEffect(() => {
        getDonations();
    }, []);
    
    const columns: GridColDef[] = React.useMemo(
        () => [
            {
                field: 'id',
                flex: 0.6,
                headerName: 'Donation ID',
                headerAlign: 'left',
                align: 'left',
            },
            {
                field: 'monetaryValue',
                flex: 0.2,
                headerName: 'Value (USD)',
                headerAlign: 'center',
                align: 'center',
                valueFormatter: (params: GridValueFormatterParams) => {
                    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
                        .format(params.value as number);
                },
            },
            {
                field: 'weight',
                flex: 0.2,
                headerName: 'Weight (lb)',
                headerAlign: 'center',
                align: 'center',
                valueFormatter: (params: GridValueFormatterParams) => {
                    return `${(params.value as number).toFixed(2)} lbs`;
                },
            },
            {
                field: 'donor',
                flex: 0.6,
                headerName: 'Donor',
                headerAlign: 'center',
                align: 'center',
            },
            {
                field: 'donatedAt',
                flex: 0.4,
                headerName: 'Donated On',
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
                    onClick={() => handleDonationDelete(params.row.id)}
                    >
                        <Delete />
                    </IconButton>
                ),
                disableExport: true,
            }
        ], []);

    return (
        <>
        <Button variant="contained" onClick={handleAddDialogOpen} color="primary">Add Donation</Button>
        <div style={{height: 800, width: `100% - ${currentWidth}px`}}>
            <DataGrid
            columns={columns}
            rows={rows}
            components={{
                Toolbar: GridToolbar
            }}
            />
        </div>
        <DonationAddForm open={addDialogOpen} onClose={handleAddDialogClose} />
        </>
    )
};

export default Donations;
