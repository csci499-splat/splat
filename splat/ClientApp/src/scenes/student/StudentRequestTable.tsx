import { DataGrid, GridColDef, GridSortModel, GridToolbar, GridValueFormatterParams, GridValueGetterParams } from '@mui/x-data-grid';
import axios from 'axios';
import React, { FC, ReactElement, useState } from 'react';
import { Pickup, PickupStatus } from '../../models/Pickup';

type StudentRequestTableProps = {

}

const StudentRequestTable: FC<StudentRequestTableProps> = (props: StudentRequestTableProps): ReactElement => {

    const columns: GridColDef[] = React.useMemo(
        () => [
        {
            field: 'id',
            flex: 0.3,
            headerName: 'Request ID',
            align: 'left',
            headerAlign: 'left',
        },
        {
            field: 'itemCount',
            flex: 0.3,
            headerName: '# Items Requested',
            valueGetter: (params: GridValueGetterParams) => {
                return params.row.itemRequests.length;
            },
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'status',
            flex: 0.5,
            headerName: 'Status',
            align: 'center',
            headerAlign: 'center',
            valueGetter: (params: GridValueGetterParams) => {
                return getStatusString(params.row.pickupStatus as PickupStatus);
            },
        },
        {
            field: 'requestedPickupTime',
            flex: 1,
            headerName: 'Requested Pickup Time',
            valueFormatter: (params: GridValueFormatterParams) => {
                return new Date(params.value as string).toLocaleString();
            },
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'active',
            flex: 0.4,
            headerName: 'Active',
            type: 'boolean',
            valueGetter: (params: GridValueGetterParams) => {
                return params.row.pickupStatus === PickupStatus.PENDING || params.row.pickupStatus === PickupStatus.WAITING;
            },
            align: 'center',
            headerAlign: 'center',
        },
    ], []);

    const [pickups, setPickups] = React.useState<Pickup[]>([]);
    const [currentWidth, setCurrentWidth] = useState(0);

    const [sortModel, setSortModel] = React.useState<GridSortModel>([
        {
          field: 'requestedPickupTime',
          sort: 'asc',
        },
    ]);

    const getStatusString = (status: PickupStatus): string => {
        switch(status) {
            case PickupStatus.PENDING:
                return "Pending fulfillment";
            case PickupStatus.WAITING:
                return "Waiting for pickup";
            case PickupStatus.DISBURSED:
                return "Picked up";
            case PickupStatus.CANCELED:
                return "Canceled";
            default:
                return "None";
        }
    };

    const getPickups = async () => {
        try {
            let res = await axios.get<Pickup[]>('/pickups');
            setPickups(res.data);
            setCurrentWidth(1 - currentWidth);
        } catch(err) {

        }
    };

    React.useEffect(() => {
        getPickups();
    }, []);

    return (
        <>
        <div style={{height: 'calc(100vh - 150px)', width: `100% - ${currentWidth}px`}}>
            <DataGrid
            columns={columns}
            rows={pickups}
            components={{ }}
            sortModel={sortModel}
            onSortModelChange={(model) => setSortModel(model)}
            />
        </div>
        </>
    )
}

export default StudentRequestTable;