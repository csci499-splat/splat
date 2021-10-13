import React, { FC, ReactElement } from 'react';
import { TableContainer, Table, TableRow, TableHead, TableBody, TableCell,
    Button, IconButton, TextField } from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import { TimePicker } from '@mui/lab';
import * as yup from 'yup';
import { Form, FormikContext, FormikProvider, useFormik } from 'formik';
import { CurrentHours } from '../../../../models/BackendTypes';
import { baseRequest } from '../../../../services/api/genericRequest';

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
            await baseRequest.post<CurrentHours>('/Hours', values);
            handleGetCurrentHours();
        },
    });

    const handleGetCurrentHours = async () => {
        formik.setTouched({});
        formik.setValues({});

        try {
            let res = await baseRequest.get<CurrentHours>('/Hours');
            setInitialValues(res.data);
        } catch(error) {

        }
    };

    const renderRow = (row: Row): ReactElement => {
        if(formik.values[row.keyName] !== undefined) {
            return (
                <TableRow key={row.keyName}>
                    <TableCell>{row.dayName}</TableCell>
                    <TableCell align="center">
                        <TimePicker
                        label="Start"
                        value={formik.values[row.keyName].timeStart}
                        onChange={(newValue) => {
                            formik.setFieldValue(`${row.keyName}.timeStart`, newValue);
                            formik.setFieldTouched(`${row.keyName}.timeStart`, true);
                        }}
                        renderInput={(params) => 
                            <TextField 
                            {...params} 
                            error={formik.touched[row.keyName]?.timeStart && Boolean(formik.errors[row.keyName]?.timeStart)}
                            helperText={formik.touched[row.keyName]?.timeStart && formik.errors[row.keyName]?.timeStart}
                            />
                        }
                        />
                    </TableCell>
                    <TableCell align="center">
                        <TimePicker
                        label="End"
                        value={formik.values[row.keyName].timeEnd}
                        onChange={(newValue) => {
                            formik.setFieldValue(`${row.keyName}.timeEnd`, newValue);
                            formik.setFieldTouched(`${row.keyName}.timeEnd`, true);
                        }}
                        renderInput={(params) => 
                            <TextField 
                            {...params} 
                            error={formik.touched[row.keyName]?.timeEnd && Boolean(formik.errors[row.keyName]?.timeEnd)}
                            helperText={formik.touched[row.keyName]?.timeEnd && formik.errors[row.keyName]?.timeEnd}
                            />
                        }
                        />
                    </TableCell>
                    <TableCell align="right">
                        <IconButton
                        onClick={() => formik.setFieldValue(row.keyName, undefined)}
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
        <FormikProvider value={formik}>
        <Form>
        <TableContainer sx={{maxWidth: '700px'}}>
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
        {Object.keys(formik.touched).length > 0 && (
            <>
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
            </>
        )}
        </>
    )
};

export default HoursTable;
