import React, { FC, ReactElement } from 'react';
import * as yup from 'yup';
import { Formik, Field, Form, FieldArray, FormikProvider, useFormik } from 'formik';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, 
    DialogTitle, 
    Grid, IconButton, TextField } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import CategoryAutocomplete from './CategoryAutocomplete';
import ItemAutocomplete from './ItemAutocomplete';
import { boolean } from 'yup/lib/locale';

type RequestFormProps = {
    onClose: () => void,
}

const initialValues = {
    student: {
        studentId: '',
        age: null,
        onMealPlan: false,
    },
    householdInfo: null,
    desiredPickupTime: new Date(),
    selections: [
        {
            category: {
                id: '',
                description: '',
                name: '',
            },
            item: {
                category: {
                    id: '',
                    description: '',
                    name: '',
                },
                id: '',
                name: '',
                description: '',
            },
            quantity: 0,
        }
    ],
};

const validationSchema = yup.object({
    student: yup.object().shape({
        studentId: yup.string()
        .required('Student ID is required'),
        age: yup.number()
        .positive()
        .integer()
        .max(80, 'Maximum age of 80 years old')
        .required('Age is required'),
        onMealPlan: yup.boolean().required(),
    }),
    householdInfo: yup.object({
        numMinors: yup.number()
        .integer()
        .min(0)
        .max(10)
        .required(),
        numAdults: yup.number()
        .integer()
        .min(0)
        .max(10)
        .required(),
        numSeniors: yup.number()
        .integer()
        .min(0)
        .max(10)
        .required(),
    }).nullable().notRequired(),
    desiredPickupTime: yup.date()
    .min(new Date())
    .required(),
    selections: yup.array()
    .of(yup.object().shape({
        category: yup.object().shape({
            id: yup.string()
            .required(),
            name: yup.string()
            .required(),
            description: yup.string()
            .required(),
        }).nullable().required('Category is required'),
        item: yup.object().shape({
            category: yup.object().shape({
                id: yup.string()
                .required(),
                name: yup.string()
                .required(),
                description: yup.string()
                .required(),
            }),
            id: yup.string()
            .required(),
            name: yup.string()
            .required(),
            description: yup.string()
            .required(),
        }).nullable().required('Item is required'),
        quantity: yup.number()
        .integer()
        .positive()
        .required(),
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

    React.useEffect(() => {
        console.log(formik.touched);
        console.log(formik.errors);
    }, [formik.errors]);

    return (
        <>
        <Dialog 
        open={true} 
        onClose={props.onClose}
        maxWidth="xl" 
        fullWidth
        >
        <DialogTitle>New Request</DialogTitle>
        <DialogContent>
        <FormikProvider
        value={formik}
        >
        <Form
        style={{height: '500px'}}>
            <FieldArray 
            name="selections">
                {({ insert, remove, push}) => (
                    <>
                    <Grid container spacing={2} style={{marginTop: '10px'}} alignItems="center">
                        {formik.values.selections.length > 0 && 
                        formik.values.selections.map((selection, index: number) => (
                            <>
                            <Grid item xs={3}>
                                <CategoryAutocomplete
                                value={formik.values.selections[index].category}
                                onValueChange={(newValue) => { 
                                    formik.setFieldValue(`selections[${index}].category`, newValue);
                                    formik.setFieldValue(`selections[${index}].item`, null);
                                }}
                                InputProps={{
                                    // @ts-ignore
                                    error: (formik.errors.selections && formik.touched.selections) ? (formik.touched.selections[index].category && Boolean(formik.errors.selections[index].category)) as boolean : false,
                                    // @ts-ignore
                                    helperText: (formik.errors.selections && formik.touched.selections) ? formik.touched.selections[index].category && formik.errors.selections[index].category : '',
                                }}
                                /> 
                            </Grid>
                            <Grid item xs={7}>
                                <ItemAutocomplete
                                value={formik.values.selections[index].item}
                                category={formik.values.selections[index].category}
                                onValueChange={(newValue) => formik.setFieldValue(`selections[${index}].item`, newValue)}
                                InputProps={{
                                    // @ts-ignore
                                    error: (formik.errors.selections && formik.touched.selections) ? (formik.touched.selections[index].item && Boolean(formik.errors.selections[index].item)) as boolean : false,
                                    // @ts-ignore
                                    helperText: (formik.errors.selections && formik.touched.selections) ? formik.touched.selections[index].item && formik.errors.selections[index].item : '',
                                }}
                                />
                            </Grid>
                            <Grid item xs={1}>
                                <TextField
                                label="Count"
                                type="number"
                                variant="outlined"
                                value={formik.values.selections[index].quantity}
                                onChange={(event) => formik.setFieldValue(`selections[${index}].quantity`, event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={1}>
                                <IconButton onClick={() => remove(index)}>
                                    <Delete />
                                </IconButton>
                            </Grid>
                            </>
                        ))}
                    </Grid>
                    <Button 
                    variant="contained"
                    endIcon={<Add />}
                    onClick={() => push({
                        category: {
                            id: '',
                            description: '',
                            name: '',
                        },
                        item: {
                            category: {
                                id: '',
                                description: '',
                                name: '',
                            },
                            id: '',
                            name: '',
                            description: '',
                        },
                        quantity: 0,
                    })}
                    sx={{marginTop: 2}}
                    >
                        Add Item
                    </Button>
                    </>
                )}
            </FieldArray>
        </Form>
        </FormikProvider>
        </DialogContent>
        <DialogActions sx={{margin: 1}}>
                <Button variant="outlined" onClick={props.onClose} color="secondary">Cancel</Button>
                <Button variant="contained" onClick={() => {console.log(formik.errors, formik.touched); formik.submitForm();}}>Submit</Button>
        </DialogActions>
        </Dialog>
        </>
    )
};

export default RequestForm;