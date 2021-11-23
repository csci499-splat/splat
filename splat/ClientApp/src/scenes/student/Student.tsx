import React, { FC, ReactElement, useState } from 'react';

import StudentRequestTable from './StudentRequestTable';

type StudentProps = {

}

const Student: FC<StudentProps> = (props: StudentProps): ReactElement => {

    return (
        <StudentRequestTable />
    );
}

export default Student;