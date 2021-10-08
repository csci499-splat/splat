import React, { FC, ReactElement } from 'react';
import * as yup from 'yup';
import { Formik, Field, Form, FieldArray, FormikProvider, useFormik, useFormikContext } 
    from 'formik';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, 
    DialogTitle, Stack,
    Grid, IconButton, TextField, Tooltip, Zoom, Divider, FormGroup, FormControlLabel, Switch } 
    from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import CategoryAutocomplete from './CategoryAutocomplete';
import ItemAutocomplete from './ItemAutocomplete';
import type { Item, Category, ItemRequest, Pickup, StudentInfo, HouseholdInfo } 
    from '../../models/BackendTypes';
import { PickupStatus } from '../../models/Pickup';
import { DateTimePicker } from '@mui/lab';

type RequestFormProps = {
    onClose: () => void,
}

const initialValues: Pickup = {
    id: null,
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
        .max(10, "Maximum of 10")
        .required("Required"),
        numAdults: yup.number()
        .integer()
        .min(0, "Must be positive")
        .max(10, "Maximum of 10")
        .required("Required"),
        numSeniors: yup.number()
        .integer()
        .min(0, "Must be positive")
        .max(10, "Maximum of 10")
        .required("Required"),
    }).optional().notRequired(),
    requestedPickupTime: yup.date()
    .min(new Date(), "Cannot be before right now")
    .max(new Date(Date.now() + (6.048e+8 * 2)), "Cannot be more than two weeks away")
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
        .required("Quantity is required"),
    }))
});

const RequestForm: FC<RequestFormProps> = (props: RequestFormProps): ReactElement => {

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            console.log(values);
            props.onClose();
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
        style={{maxHeight: '600px'}}>
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
            {formik.values.householdInfo === undefined ? (
                <Tooltip 
                title="Add additional information if these items will be shared with people other than yourself" 
                TransitionComponent={Zoom}
                arrow
                >
                <Button
                variant="outlined"
                color="secondary"
                startIcon={<Add />}
                onClick={() => handleHouseholdAdd()}
                >
                    Add Household Information (optional)
                </Button>
                </Tooltip>
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
                            <>
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
                                label="Count"
                                type="number"
                                variant="outlined"
                                name={`itemRequests[${index}].quantity`}
                                value={formik.values.itemRequests[index].quantity}
                                onChange={(event) => formik.setFieldValue(`itemRequests[${index}].quantity`, event.target.value)}
                                // @ts-ignore
                                error={(formik.errors.itemRequests && formik.touched.itemRequests) && (formik.touched.itemRequests[index])?.quantity && Boolean((formik.errors.itemRequests[index])?.quantity)}
                                // @ts-ignore
                                helperText={(formik.errors.itemRequests && formik.touched.itemRequests) && (formik.touched.itemRequests[index])?.quantity && (formik.errors.itemRequests[index])?.quantity}
                                />
                            </Grid>
                            <Grid item xs={1}>
                                { formik.values.itemRequests.length > 1 && (
                                    <IconButton onClick={() => remove(index)}>
                                        <Delete />
                                    </IconButton>
                                )}
                            </Grid>
                            </>
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
                <DateTimePicker
                renderInput={(props) => 
                    <TextField 
                    {...props} 
                    error={formik.touched.requestedPickupTime && Boolean(formik.errors.requestedPickupTime)}
                    helperText={formik.touched.requestedPickupTime && formik.errors.requestedPickupTime}
                    />
                }
                label="Desired pickup time"
                value={formik.values.requestedPickupTime}
                minDateTime={new Date()}
                maxDateTime={new Date(Date.now() + (6.048e+8 * 2))}
                onChange={(newValue) => {
                    formik.setFieldValue("requestedPickupTime", newValue);
                    formik.setFieldTouched("requestedPickupTime", true);
                }}
                showTodayButton
                clearable
                ampm
                ampmInClock
                />
            </Stack>
        </Form>
        </FormikProvider>
        </DialogContent>
        <DialogActions sx={{margin: 1}}>
                <Button variant="outlined" onClick={props.onClose} color="secondary">Cancel</Button>
                <Button variant="contained" onClick={() => formik.submitForm()}>Submit</Button>
        </DialogActions>
        </Dialog>
        </>
    )
};

export default RequestForm;