import { Calculate, Delete } from '@mui/icons-material';
import { Button, IconButton, Menu, MenuItem } from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridRenderCellParams,
    GridRowData,
    GridToolbar,
    GridValueGetterParams
} from '@mui/x-data-grid';
import axios from 'axios';
import React, { FC, ReactElement } from 'react';
import User from '../../../models/User';
import { IStaffChild } from '../Staff';
import UserAddForm from '../subcomponents/UserAddForm';

interface UsersProps extends IStaffChild {
    
}

type UserRolePickerProps = {
    initialRole: string;
    changeRole: (newRole: string) => Promise<void>;
};

const roles = [
    'Administrator',
    'Staff',
    'Student',
]

const UserRolePicker: FC<UserRolePickerProps> = (props: UserRolePickerProps): ReactElement => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState(roles.indexOf(props.initialRole));
    const open = Boolean(anchorEl);

    const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSelectItem = async (event: React.MouseEvent<HTMLElement>, index: number) => {
        setSelectedIndex(index);
        setAnchorEl(null);
        await props.changeRole(roles[index]);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
            onClick={handleClickMenu}
            variant="text"
            color="primary"
            >
                { props.initialRole }
            </Button>
            <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            >
                { roles.map((val, index) => (
                    <MenuItem
                    key={index}
                    disabled={index === selectedIndex}
                    selected={index === selectedIndex}
                    onClick={(event) => handleSelectItem(event, index)}
                    >
                        { val }
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}

const Users: FC<UsersProps> = (props: UsersProps): ReactElement => {

    const [addDialogOpen, setAddDialogOpen] = React.useState(false);
    const [rows, setRows] = React.useState<User[]>([]);
    const [currentWidth, setCurrentWidth] = React.useState(0);

    const handleAddDialogOpen = () => {
        setAddDialogOpen(true);
    };

    const handleAddDialogClose = () => {
        setAddDialogOpen(false);
    };

    const handleUserChangeRole = async (id: string, newRole: string) => {
        try {
            await axios.post(`/user/role`, { username: id, newRole: newRole });
            getUsers();
        } catch(error) {

        }
    };

    const getUsers = async () => {
        try {
            let res = await axios.get<User[]>('/user');

            let dataRows = res.data.map((row) => {
                row['id'] = row.email;
                return row;
            });
            
            setRows(dataRows);
            setCurrentWidth(1 - currentWidth);
        } catch (error) {
            
        }
    };

    React.useEffect(() => {
        getUsers();
    }, []);

    const columns: GridColDef[] = React.useMemo(
        () => [
            {
                field: 'email',
                flex: 0.6,
                headerName: 'User Email',
                headerAlign: 'left',
                align: 'left',
            },
            {
                field: 'role',
                flex: 0.5,
                headerName: 'User Role',
                headerAlign: 'center',
                align: 'center',
                renderCell: (params: GridRenderCellParams) => (
                    <UserRolePicker
                    initialRole={params.row.role}
                    changeRole={(newRole) => handleUserChangeRole(params.row.email, newRole)}
                    />
                ),
                valueGetter: (params: GridValueGetterParams) => params.row.roles,
            }
        ], []);


    return (
        <>
        {//<Button variant="contained" onClick={handleAddDialogOpen} color="primary">Add Privileged User</Button>
        }
        <div style={{height: 'calc(100vh - 275px)', width: `100% - ${currentWidth}px`}}>
            <DataGrid
            columns={columns}
            rows={rows}
            components={{
                Toolbar: GridToolbar
            }}
            />
        </div>
        <UserAddForm
        open={addDialogOpen}
        onClose={handleAddDialogClose}
        changeRole={handleUserChangeRole}
        />
        </>
    )
};

export default Users;
