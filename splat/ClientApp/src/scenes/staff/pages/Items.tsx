import { Button } from '@mui/material';
import React, { FC, ReactElement, useState } from 'react';

import { IStaffChild } from '../Staff';
import ItemsAddDialog from '../subcomponents/ItemsAddDialog';
import ItemsTable from '../subcomponents/ItemsTable';

interface ItemProps extends IStaffChild {
    
}

const Items: FC<ItemProps> = (props: ItemProps): ReactElement => {

    return (
        <ItemsTable />
    );
};

export default Items;