import React, { FC, ReactElement } from 'react';
import * as yup from 'yup';
import { Formik, Field, Form, FieldArray, FormikProvider, useFormik } from 'formik';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, 
    DialogTitle, 
    Grid, IconButton, TextField } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

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
                name: '',
            },
            item: {
                id: '',
                name: '',
                description: '',
            },
            quantity: 0,
        }
    ],
};

const validationSchema = yup.object({

});

const RequestForm: FC<RequestFormProps> = (props: RequestFormProps): ReactElement => {

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            console.log(values);
            props.onClose();
        },
    })

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
                    <Grid container spacing={2} style={{marginTop: '10px'}}>
                        {formik.values.items.length > 0 && 
                        formik.values.items.map((item, index: number) => (
                            <>
                            <Grid item xs={3}>
                                <Autocomplete
                                disablePortal
                                id="category-box"
                                options={['test1', 'test2']}
                                sx={{width: '100%'}}
                                renderInput={(params) => <TextField {...params} label="Category" />}
                                renderOption={(props, option) => option}
                                /> 
                            </Grid>
                            <Grid item xs={7}>
                                <Autocomplete
                                disablePortal
                                id="item-box"
                                options={['test item 1', 'test item 2']}
                                sx={{width: '100%'}}
                                renderInput={(params) => <TextField {...params} label="Item" />}
                                /> 
                            </Grid>
                            <Grid item xs={1}>
                                <TextField
                                label="Count"
                                type="number"
                                variant="outlined"
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
                            name: '',
                        },
                        item: {
                            id: '',
                            name: '',
                            description: '',
                        },
                        quantity: 0
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