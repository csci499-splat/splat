import React, { FC, ReactElement, useState } from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps}
    from 'react-router-dom';
import { Box, Paper, Grid, Button, TextField, Typography,
        styled, Stack, Divider, useTheme, Link, AppBar,
     } from '@mui/material';
import { IStaffChild } from '../Staff';
import ItemsAddDialog from '../subcomponents/ItemsAddDialog';
import ItemsTable from '../subcomponents/ItemsTable';

interface ItemProps extends IStaffChild {
    
}

const Items: FC<ItemProps> = (props: ItemProps): ReactElement => {

    const [addItemsOpen, setAddItemsOpen] = React.useState(false);
    
    const handleShowAddItems = () => {
        setAddItemsOpen(true);
    }

    // TODO: refresh data in the table when a new item is added

    return (
        <>
        <Button
        variant="contained"
        onClick={handleShowAddItems}
        >
            Create Item
        </Button>
        <ItemsTable />
        <ItemsAddDialog
        onClose={() => setAddItemsOpen(false)}
        open={addItemsOpen}
        />
        </>
    )
};

export default Items;