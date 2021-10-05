import React, { FC, ReactElement } from 'react';
import { IStaffChild } from '../Staff';

interface PickupProps extends IStaffChild {
    
}

const Pickups: FC<PickupProps> = (props: PickupProps): ReactElement => {



    return (
        <>
        <h1>{props.pageName}</h1>
        </>
    )
};

export default Pickups;
