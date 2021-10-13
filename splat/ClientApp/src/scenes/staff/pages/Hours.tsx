import React, { FC, ReactElement } from 'react';
import { IStaffChild } from '../Staff';

interface HoursProps extends IStaffChild {
    
}

const Hours: FC<HoursProps> = (props: HoursProps): ReactElement => {



    return (
        <>
        <h1>{props.pageName}</h1>
        </>
    )
};

export default Hours;
