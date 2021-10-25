import React, { FC, ReactElement } from 'react';

import { IStaffChild } from '../Staff';

interface HistoryProps extends IStaffChild {
    
}

const History: FC<HistoryProps> = (props: HistoryProps): ReactElement => {



    return (
        <>
        <h1>{props.pageName}</h1>
        </>
    )
};

export default History;