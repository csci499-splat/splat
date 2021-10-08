import React, { FC, ReactElement } from 'react';
import { IStaffChild } from '../Staff';

interface ItemProps extends IStaffChild {
    
}

const Items: FC<ItemProps> = (props: ItemProps): ReactElement => {



    return (
        <>
        <h1>{props.pageName}</h1>
        </>
    )
};

export default Items;
