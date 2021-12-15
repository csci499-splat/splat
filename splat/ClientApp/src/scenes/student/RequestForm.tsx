import { Add, Delete } from '@mui/icons-material';
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    FormGroup,
    Grid,
    IconButton,
    Stack,
    Switch,
    TextField,
    Tooltip,
    Zoom,
} from '@mui/material';
import { FieldArray, Form, FormikProvider, useFormik } from 'formik';
import React, { FC, ReactElement } from 'react';
import * as yup from 'yup';

import TimeSelector from '../../components/common/TimeSelector';
import { PickupStatus } from '../../models/Pickup';
import CategoryAutocomplete from './CategoryAutocomplete';
import ItemAutocomplete from './ItemAutocomplete';

import type { Pickup, } 
    from '../../models/BackendTypes';
import PickupDateTimeSelector from './PickupDateTimeSelector';
import { HourRange } from '../../models/CurrentHours';
import moment from 'moment';
import axios from 'axios';
type RequestFormProps = {
    onClose: () => void,
}

const initialValues: Pickup = {
    studentInfo: {
        studentId: '',
        age: undefined,
        onMealPlan: false,
    },
    householdInfo: undefined,
    requestedPickupTime: new Date(),
    submittedAt: null,
    itemRequests: [
        {
            category: {
                id: null,
                name: '',
                description: '',
                limit: 0,
                icon: '',
                visible: false,
                createdAt: null,
            },
            item: {
                id: null,
                name: '',
                category: {
                    id: null,
                    name: '',
                    description: '',
                    limit: 0,
                    icon: '',
                    visible: false,
                    createdAt: null,
                },
                categoryId: '',
                description: '',
                visible: false,
                createdAt: null,
            },
            quantity: 1,
        }
    ],
    pickupStatus: PickupStatus.PENDING,
    otherNotes: '',
};

type DateTimeObj = {
    date: Date | null;
    time: Date | null;
};

const RequestForm: FC<RequestFormProps> = (props: RequestFormProps): ReactElement => {

    const [pickupTimes, setPickupTimes] = React.useState<{date: Date | null, time: Date | null}>({date: new Date(), time: new Date()});
    const [hourBounds, setHourBounds] = React.useState<HourRange>({timeStart: new Date(0, 0, 0, 0, 0), timeEnd: new Date(0, 0, 0, 23, 59)});

    const validationSchema = yup.object({
        studentInfo: yup.object().shape({
            studentId: yup.string()
            .matches(/[0-9]{7}/g, "Student ID must be exactly 7 digits long")
            .required('Student ID is required'),
            age: yup.number()
            .positive()
            .integer()
            .max(120, 'Maximum age of 120 years old')
            .required('Age is required'),
            onMealPlan: yup.boolean().required("Required"),
        }).required(),
        householdInfo: yup.object().shape({
            numMinors: yup.number()
            .integer()
            .min(0, "Must be positive")
            .max(10, "Maximum of 10"),
            numAdults: yup.number()
            .integer()
            .min(0, "Must be positive")
            .max(10, "Maximum of 10"),
            numSeniors: yup.number()
            .integer()
            .min(0, "Must be positive")
            .max(10, "Maximum of 10"),
        }).optional().notRequired(),
        requestedPickupTime: yup.date()
        .test(
            'inRange',
            "Must be within pantry hours",
            function(item) {
                let usedHourBounds: HourRange = {
                    // @ts-ignore
                    timeStart: new Date(item.getFullYear(), item.getMonth(), item.getDate(),
                                    hourBounds.timeStart.getHours(), hourBounds.timeStart.getMinutes()),
                    // @ts-ignore
                    timeEnd: new Date(item.getFullYear(), item.getMonth(), item.getDate(),
                                    hourBounds.timeEnd.getHours(), hourBounds.timeEnd.getMinutes()),
                };

                if(item)
                    return moment(item).isAfter(usedHourBounds.timeStart, 'minute') &&
                           moment(item).isBefore(usedHourBounds.timeEnd, 'minute');
                return true;
            }
        )
        .nullable()
        .required("Required"),
        itemRequests: yup.array()
        .of(yup.object().shape({
            category: yup.object().shape({
                id: yup.string().nullable()
                .required("Category is required"),
                name: yup.string()
                .required(),
                description: yup.string()
                .required(),
            }).nullable().required('Category is required'),
            item: yup.object().shape({
                category: yup.object().shape({
                    id: yup.string().nullable()
                    .required(),
                    name: yup.string()
                    .required(),
                    description: yup.string()
                    .required(),
                }),
                id: yup.string().nullable()
                .required("Item is required"),
                name: yup.string()
                .required(),
                description: yup.string()
                .required(),
            }).nullable().required('Item is required'),
            quantity: yup.number()
            .integer()
            .positive("Quantity must be 1 or more")
            .test(
                'maxQuantity',
                'Must not be greater than the max allowed',
                function(item) {
                    if(!item) return false;

                    return item <= this.parent.category.limit;
                }
            )
            .required("Quantity is required"),
        }))
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            values.submittedAt = new Date();
            try {
                await axios.post('/pickups', values);
                props.onClose();
            } catch(err) {

            }
            
        },
    });

    const handleHouseholdAdd = () => {
        formik.setFieldValue('householdInfo', {
            numSeniors: 0,
            numAdults: 0,
            numMinors: 0,
        });
    };

    const handleHouseholdRemove = () => {
        formik.setFieldValue('householdInfo', undefined);
    };

    const handleDateChange = (newDateTime: DateTimeObj) => {
        setPickupTimes(newDateTime);

        if(newDateTime.date && newDateTime.time) {
            let newDate = new Date( newDateTime.date.getFullYear(),
                                    newDateTime.date.getMonth(),
                                    newDateTime.date.getDate(),
                                    newDateTime.time.getHours(),
                                    newDateTime.time.getMinutes());
            formik.setFieldValue("requestedPickupTime", newDate);
        }
        
        formik.setFieldTouched("requestedPickupTime", true);
    };

    return (
        <>
        <Dialog 
        open={true} 
        onClose={props.onClose}
        maxWidth="lg" 
        fullWidth
        >
        <DialogTitle>New Request</DialogTitle>
        <DialogContent>
        <FormikProvider
        value={formik}
        >
        <Form
        style={{maxHeight: '600px'}}
        >
            { /* TODO: Add StudentInfo fields here */}
            <Stack direction="row" spacing={2} sx={{marginTop: 1, marginBottom: 2}} alignItems="flex-start">
                <TextField
                label="Student ID"
                variant="outlined"
                name="studentInfo.studentId"
                value={formik.values.studentInfo.studentId}
                onChange={formik.handleChange}
                // @ts-ignore
                error={formik.touched.studentInfo?.studentId && Boolean(formik.errors.studentInfo?.studentId)}
                // @ts-ignore
                helperText={formik.touched.studentInfo?.studentId && formik.errors.studentInfo?.studentId}
                />
                <TextField
                label="Student Age"
                variant="outlined"
                type="number"
                name="studentInfo.age"
                value={formik.values.studentInfo.age}
                onChange={formik.handleChange}
                // @ts-ignore
                error={formik.touched.studentInfo?.age && Boolean(formik.errors.studentInfo?.age)}
                // @ts-ignore
                helperText={formik.touched.studentInfo?.age && formik.errors.studentInfo?.age}
                />
                <FormGroup>
                    <FormControlLabel 
                    control={
                        <Switch 
                        size="medium"
                        checked={formik.values.studentInfo.onMealPlan}
                        name="studentInfo.onMealPlan"
                        onChange={formik.handleChange}
                        />
                    }
                    label="On a meal plan?"
                    labelPlacement="top"
                    />
                </FormGroup>
            </Stack>
            <Divider />
            <Stack direction="row" spacing={2} sx={{marginTop: 2, marginBottom: 2}} alignItems="flex-start">
                <FormControlLabel
                control={
                    <Checkbox
                    defaultChecked
                    checked={formik.values.householdInfo === undefined}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                        if(event.target.checked) {
                            handleHouseholdRemove();
                        } else {
                            handleHouseholdAdd();
                        }
                    }}
                    />
                }
                label="I am the only one in my household"
                />
            {formik.values.householdInfo === undefined ? (
                <>
                </>
            ) : (
                <>
                <TextField
                label="Number of minors"
                type="number"
                variant="outlined"
                name="householdInfo.numMinors"
                value={formik.values.householdInfo.numMinors}
                onChange={formik.handleChange}
                // @ts-ignore
                error={formik.touched.householdInfo?.numMinors && Boolean(formik.errors.householdInfo?.numMinors)}
                // @ts-ignore
                helperText={formik.touched.householdInfo?.numMinors && formik.errors.householdInfo?.numMinors}
                />
                <TextField
                label="Number of adults"
                type="number"
                variant="outlined"
                name="householdInfo.numAdults"
                value={formik.values.householdInfo.numAdults}
                onChange={formik.handleChange}
                // @ts-ignore
                error={formik.touched.householdInfo?.numAdults && Boolean(formik.errors.householdInfo?.numAdults)}
                // @ts-ignore
                helperText={formik.touched.householdInfo?.numAdults && formik.errors.householdInfo?.numAdults}
                />
                <TextField
                label="Number of seniors"
                type="number"
                variant="outlined"
                name="householdInfo.numSeniors"
                value={formik.values.householdInfo.numSeniors}
                onChange={formik.handleChange}
                // @ts-ignore
                error={formik.touched.householdInfo?.numSeniors && Boolean(formik.errors.householdInfo?.numSeniors)}
                // @ts-ignore
                helperText={formik.touched.householdInfo?.numSeniors && formik.errors.householdInfo?.numSeniors}
                />
                <Button
                variant="outlined"
                startIcon={<Delete />}
                color="error"
                onClick={() => handleHouseholdRemove()}
                >
                    Remove household information
                </Button>
                </>
            )}
            </Stack>
            <Divider />
            <FieldArray 
            name="itemRequests">
                {({ insert, remove, push}) => (
                    <>
                    <Grid container spacing={2} style={{marginTop: '10px'}} alignItems="flex-start">
                        {formik.values.itemRequests.length > 0 && 
                        formik.values.itemRequests.map((selection, index: number) => {
                            return (
                            <React.Fragment key={index}>
                            <Grid item xs={3}>
                                <CategoryAutocomplete
                                value={formik.values.itemRequests[index].category}
                                onValueChange={(newValue) => { 
                                    formik.setFieldValue(`itemRequests[${index}].category`, newValue);
                                    formik.setFieldValue(`itemRequests[${index}].item`, null);
                                }}
                                InputProps={{
                                    name: `itemRequests[${index}].category`,
                                    // @ts-ignore
                                    error: (formik.errors.itemRequests && formik.touched.itemRequests) && (formik.touched.itemRequests[index])?.category && Boolean((formik.errors.itemRequests[index])?.category),
                                    // @ts-ignore
                                    helperText: (formik.errors.itemRequests && formik.touched.itemRequests) && (formik.touched.itemRequests[index])?.category && (formik.errors.itemRequests[index])?.category?.id,
                                }}
                                /> 
                            </Grid>
                            <Grid item xs={7}>
                                <ItemAutocomplete
                                value={formik.values.itemRequests[index].item}
                                category={formik.values.itemRequests[index].category}
                                onValueChange={(newValue) => formik.setFieldValue(`itemRequests[${index}].item`, newValue)}
                                InputProps={{
                                    name: `itemRequests[${index}].item`,
                                    // @ts-ignore
                                    error: (formik.errors.itemRequests && formik.touched.itemRequests) && (formik.touched.itemRequests[index])?.item && Boolean((formik.errors.itemRequests[index])?.item),
                                    // @ts-ignore
                                    helperText: (formik.errors.itemRequests && formik.touched.itemRequests) && (formik.touched.itemRequests[index])?.item && (formik.errors.itemRequests[index])?.item?.id,
                                }}
                                />
                            </Grid>
                            <Grid item xs={1}>
                                <TextField
                                label="Quantity"
                                type="number"
                                variant="outlined"
                                name={`itemRequests[${index}].quantity`}
                                value={formik.values.itemRequests[index].quantity}
                                onChange={(event) => formik.setFieldValue(`itemRequests[${index}].quantity`, Number(event.target.value))}
                                // @ts-ignore
                                error={(formik.errors.itemRequests && formik.touched.itemRequests) && (formik.touched.itemRequests[index])?.quantity && Boolean((formik.errors.itemRequests[index])?.quantity)}
                                // @ts-ignore
                                helperText={`Limit ${formik.values.itemRequests[index].category?.limit}`}
                                />
                            </Grid>
                            <Grid item xs={1}>
                                { formik.values.itemRequests.length > 1 && (
                                    <IconButton onClick={() => remove(index)}>
                                        <Delete />
                                    </IconButton>
                                )}
                            </Grid>
                            </React.Fragment>
                        )})}
                    </Grid>
                    <Button 
                    variant="contained"
                    endIcon={<Add />}
                    onClick={() => push({
                        category: {
                            id: null,
                            name: '',
                            description: '',
                            limit: 0,
                            icon: '',
                            visible: false,
                            createdAt: null,
                        },
                        item: {
                            id: null,
                            name: '',
                            category: {
                                id: null,
                                name: '',
                                description: '',
                                limit: 0,
                                icon: '',
                                visible: false,
                                createdAt: null,
                            },
                            description: '',
                            visible: false,
                            createdAt: null,
                        },
                        quantity: 1,
                    })}
                    sx={{marginTop: 2, marginBottom: 2}}
                    >
                        Add Item
                    </Button>
                    </>
                )}
            </FieldArray>
            <Divider />
            <Stack direction="row" spacing={2} sx={{marginTop: 2, marginBottom: 2}} alignItems="flex-start">
                <TextField
                label="Notes for the staff"
                multiline
                maxRows={4}
                name="otherNotes"
                value={formik.values.otherNotes}
                onChange={formik.handleChange}
                sx={{width: '30%'}}
                />
                <label>Pickup Date & Time</label>
                <PickupDateTimeSelector
                value={pickupTimes}
                onChange={(newValue) => handleDateChange(newValue)}
                onHoursChange={(newHours: HourRange) => setHourBounds(newHours)}
                error={formik.touched.requestedPickupTime && Boolean(formik.errors.requestedPickupTime)}
                // @ts-ignore
                helperText={formik.touched.requestedPickupTime && (formik.errors.requestedPickupTime)}
                //helperText={`Select your pick up date and time`}
                />
            </Stack>
        </Form>
        </FormikProvider>
        </DialogContent>
        <DialogActions sx={{margin: 1}}>
                <Button variant="outlined" onClick={props.onClose} color="secondary">Cancel</Button>
                <Button variant="contained" onClick={() => {formik.submitForm()}}>Submit</Button>
        </DialogActions>
        </Dialog>
        </>
    )
};

export default RequestForm;