import { Add, Delete } from '@mui/icons-material';
import { TimePicker } from '@mui/lab';
import {
    Button,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from '@mui/material';
import axios from 'axios';
import { Form, FormikProvider, useFormik } from 'formik';
import React, { FC, ReactElement } from 'react';
import * as yup from 'yup';

import { CurrentHours } from '../../../../models/BackendTypes';

type HoursTableProps = {
    
}

type Row = {
    dayName: string;
    keyName: string;
}

const rows: Row[] = [
    {
        dayName: 'Sunday',
        keyName: 'sundayHours',
    },
    {
        dayName: 'Monday',
        keyName: 'mondayHours',
    },
    {
        dayName: 'Tuesday',
        keyName: 'tuesdayHours',
    },
    {
        dayName: 'Wednesday',
        keyName: 'wednesdayHours',
    },
    {
        dayName: 'Thursday',
        keyName: 'thursdayHours',
    },
    {
        dayName: 'Friday',
        keyName: 'fridayHours',
    },
    {
        dayName: 'Saturday',
        keyName: 'saturdayHours',
    },
];

const validationSchema = yup.object({
    sundayHours: yup
    .object().shape({
        timeStart: yup
        .date()
        .required("Required"),
        timeEnd: yup
        .date()
        .min(yup.ref('timeStart'), 'Must be greater than start')
        .required("Required"),
    })
    .notRequired()
    .nullable()
    .default(undefined),
    mondayHours: yup
    .object().shape({
        timeStart: yup
        .date()
        .required("Required"),
        timeEnd: yup
        .date()
        .min(yup.ref('timeStart'), 'Must be greater than start')
        .required("Required"),
    })
    .notRequired()
    .nullable()
    .default(undefined),
    tuesdayHours: yup
    .object().shape({
        timeStart: yup
        .date()
        .required("Required"),
        timeEnd: yup
        .date()
        .min(yup.ref('timeStart'), 'Must be greater than start')
        .required("Required"),
    })
    .notRequired()
    .nullable()
    .default(undefined),
    wednesdayHours: yup
    .object().shape({
        timeStart: yup
        .date()
        .required("Required"),
        timeEnd: yup
        .date()
        .min(yup.ref('timeStart'), 'Must be greater than start')
        .required("Required"),
    })
    .notRequired()
    .nullable()
    .default(undefined),
    thursdayHours: yup
    .object().shape({
        timeStart: yup
        .date()
        .required("Required"),
        timeEnd: yup
        .date()
        .min(yup.ref('timeStart'), 'Must be greater than start')
        .required("Required"),
    })
    .notRequired()
    .nullable()
    .default(undefined),
    fridayHours: yup
    .object().shape({
        timeStart: yup
        .date()
        .required("Required"),
        timeEnd: yup
        .date()
        .min(yup.ref('timeStart'), 'Must be greater than start')
        .required("Required"),
    })
    .notRequired()
    .nullable()
    .default(undefined),
    saturdayHours: yup
    .object().shape({
        timeStart: yup
        .date()
        .required("Required"),
        timeEnd: yup
        .date()
        .min(yup.ref('timeStart'), 'Must be greater than start')
        .required("Required"),
    })
    .notRequired()
    .nullable()
    .default(undefined),
});

const HoursTable: FC<HoursTableProps> = (props: HoursTableProps): ReactElement => {

    const [initialValues, setInitialValues] = React.useState<CurrentHours>({
        sundayHours: undefined,
        mondayHours: undefined,
        tuesdayHours: undefined,
        wednesdayHours: undefined,
        thursdayHours: undefined,
        fridayHours: undefined,
        saturdayHours: undefined,
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            await axios.post<CurrentHours>('/Hours', {...values, createdAt: undefined});
            handleGetCurrentHours();
        },
    });

    const handleGetCurrentHours = async () => {
        formik.setTouched({});
        formik.setValues({});

        try {
            let res = await axios.get<CurrentHours>('/Hours');
            console.log(res.data);
            if(res.data !== "")
                setInitialValues(res.data);
        } catch(error) {

        }
    };

    const renderRow = (row: Row): ReactElement => {
        if(formik.values[row.keyName]) {
            return (
                <TableRow key={row.keyName}>
                    <TableCell>{row.dayName}</TableCell>
                    <TableCell align="center">
                        <TimePicker
                        label="Start"
                        value={(formik.values[row.keyName]) ? formik.values[row.keyName].timeStart : undefined}
                        onChange={(newValue) => {
                            formik.setFieldValue(`${row.keyName}.timeStart`, newValue);
                            formik.setFieldTouched(`${row.keyName}.timeStart`, true);
                        }}
                        renderInput={(params) => 
                            <TextField 
                            {...params} 
                            sx={{width: '140px'}}
                            error={formik.touched[row.keyName]?.timeStart && Boolean(formik.errors[row.keyName]?.timeStart)}
                            helperText={formik.touched[row.keyName]?.timeStart && formik.errors[row.keyName]?.timeStart}
                            />
                        }
                        />
                    </TableCell>
                    <TableCell align="center">
                        <TimePicker
                        label="End"
                            value={(formik.values[row.keyName]) ? formik.values[row.keyName].timeEnd : undefined}
                        onChange={(newValue) => {
                            formik.setFieldValue(`${row.keyName}.timeEnd`, newValue);
                            formik.setFieldTouched(`${row.keyName}.timeEnd`, true);
                        }}
                        renderInput={(params) => 
                            <TextField 
                            {...params} 
                            sx={{width: '140px'}}
                            error={formik.touched[row.keyName]?.timeEnd && Boolean(formik.errors[row.keyName]?.timeEnd)}
                            helperText={formik.touched[row.keyName]?.timeEnd && formik.errors[row.keyName]?.timeEnd}
                            />
                        }
                        />
                    </TableCell>
                    <TableCell align="right">
                        <IconButton
                        onClick={() => { formik.setFieldValue(row.keyName, undefined); formik.setFieldTouched(row.keyName, true); }}
                        >
                            <Delete />
                        </IconButton>
                    </TableCell>
                </TableRow>
            );
        } else {
            return (
                <TableRow key={row.keyName}>
                    <TableCell>{row.dayName}</TableCell>
                    <TableCell align="center">
                        <em>None</em>
                    </TableCell>
                    <TableCell align="center">
                        <em>None</em>
                    </TableCell>
                    <TableCell align="right">
                        <IconButton
                        onClick={() => {
                            formik.setFieldValue(row.keyName, {
                            timeStart: new Date(),
                            timeEnd: new Date(),
                            });
                            formik.setFieldTouched(row.keyName, true);
                        }}
                        >
                            <Add />
                        </IconButton>
                    </TableCell>
                </TableRow>
            );
        }
    };

    React.useEffect(() => {
        handleGetCurrentHours();
    }, []);

    return (
        <>
        <Stack direction="column" alignItems="center" spacing={2}>
        {Object.keys(formik.touched).length > 0 && (
            <>
            <Stack direction="row" spacing={2}>
            <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleGetCurrentHours()}
            >
                Cancel
            </Button>
            <Button 
            variant="contained"
            color="primary"
            onClick={() => formik.submitForm()}
            >
                Save
            </Button>
            </Stack>
            </>
        )}
        <FormikProvider value={formik}>
        <Form>
        <TableContainer sx={{maxWidth: '1000px'}}>
            <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Day</TableCell>
                    <TableCell align="center">Start Time</TableCell>
                    <TableCell align="center">End Time</TableCell>
                    <TableCell align="right">Remove</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row, index) => renderRow(row))}
            </TableBody>
            </Table>
        </TableContainer>
        </Form>
        </FormikProvider>
        </Stack>
        </>
    )
};

export default HoursTable;
