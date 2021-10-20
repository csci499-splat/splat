import React, { FC, ReactElement } from 'react';

import { IStaffChild } from '../Staff';

interface ReportProps extends IStaffChild {
    
}

const Reports: FC<ReportProps> = (props: ReportProps): ReactElement => {



    return (
        <>
        <h1>{props.pageName}</h1>
        </>
    )
};

export default Reports;
