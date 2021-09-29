import React, { FC, ReactElement } from 'react';
import * as yup from 'yup';
import { Formik, Field, Form, FieldArray, FormikProvider, useFormik } from 'formik';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, 
    DialogTitle, 
    Grid, IconButton, TextField } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import CategoryAutocomplete from './CategoryAutocomplete';
import ItemAutocomplete from './ItemAutocomplete';

type RequestFormProps = {
    onClose: () => void,
}

const initialValues = {
    email: 'test@test.com',
    householdInfo: {
        minors: 0,
        adults: 0,
        seniors: 0,
    },
    items: [
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
    email: yup.string()
    .required(),
    householdInfo: yup.object({

    }),
    items: yup.array()
    .of(yup.object().shape({
        
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
            name="items">
                {({ insert, remove, push}) => (
                    <>
                    <Grid container spacing={2} style={{marginTop: '10px'}} alignItems="center">
                        {formik.values.items.length > 0 && 
                        formik.values.items.map((item, index: number) => (
                            <>
                            <Grid item xs={3}>
                                <CategoryAutocomplete
                                value={formik.values.items[index].category}
                                onValueChange={(newValue) => { 
                                    formik.setFieldValue(`items[${index}].category`, newValue);
                                    formik.setFieldValue(`items[${index}].item`, null);
                                }}
                                /> 
                            </Grid>
                            <Grid item xs={7}>
                                <ItemAutocomplete
                                value={formik.values.items[index].item}
                                category={formik.values.items[index].category}
                                onValueChange={(newValue) => formik.setFieldValue(`items[${index}].item`, newValue)}
                                />
                            </Grid>
                            <Grid item xs={1}>
                                <TextField
                                label="Count"
                                type="number"
                                variant="outlined"
                                value={formik.values.items[index].quantity}
                                onChange={(event) => formik.setFieldValue(`items[${index}].quantity`, event.target.value)}
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
                <Button variant="contained" onClick={() => formik.submitForm()}>Submit</Button>
        </DialogActions>
        </Dialog>
        </>
    )
};

export default RequestForm;