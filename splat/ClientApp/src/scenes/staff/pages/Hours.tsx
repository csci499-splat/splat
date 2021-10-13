import React, { FC, ReactElement } from 'react';
import { IStaffChild } from '../Staff';
import HoursTable from '../subcomponents/hours/HoursTable';

interface HoursProps extends IStaffChild {
    
}

const Hours: FC<HoursProps> = (props: HoursProps): ReactElement => {



    return (
        <>
        <HoursTable />
        </>
    )
};

export default Hours;
