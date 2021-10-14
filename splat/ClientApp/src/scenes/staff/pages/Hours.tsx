import React, { FC, ReactElement } from 'react';
import { IStaffChild } from '../Staff';
import HoursTable from '../subcomponents/hours/HoursTable';
import HoursDaySelector from '../subcomponents/hours/HoursDaySelector';

interface HoursProps extends IStaffChild {
    
}

const Hours: FC<HoursProps> = (props: HoursProps): ReactElement => {



    return (
        <>
        <HoursTable />
        <HoursDaySelector />
        </>
    )
};

export default Hours;
