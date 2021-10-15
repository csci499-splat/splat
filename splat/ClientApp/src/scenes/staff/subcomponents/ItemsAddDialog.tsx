import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    FormGroup,
    Stack,
    Switch,
    TextField,
} from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import React, { FC, ReactElement } from 'react';
import * as yup from 'yup';

import { baseRequest } from '../../../services/api/genericRequest';
import CategoryAutocomplete from '../../student/CategoryAutocomplete';

type ItemsAddDialogProps = {
    onClose: () => void,
    open: boolean;
}

const validationSchema = yup.object({   
    name: yup.string()
    .max(25, ({ max }) => `Name can't be more than ${max} characters long`)
    .required("Name is required"),
    description: yup.string()
    .max(250, ({ max }) => `Description can't be more than ${max} characters long`)
    .required("Description is required"),
    category: yup.object().shape({
        id: yup
        .string()
        .nullable()
        .required('Category is required'),
    })
    .required('Category is required'),
    visible: yup
    .boolean()
    .required("Required"),
});

const ItemsAddDialog: FC<ItemsAddDialogProps> = (props: ItemsAddDialogProps): ReactElement =>{

    const initialValues = {
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
        visible: true,
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            let newValues = {
                name: values.name,
                categoryId: values.category.id,
                description: values.description,
                visible: values.visible,
            }
            console.log(newValues);
            await baseRequest.post('/items', newValues);
            props.onClose();
        },
    });
    return(
        <>
        <Dialog 
        open={props.open} 
        onClose={props.onClose}
        >
        <DialogTitle>New Item</DialogTitle>
        <DialogContent>
        <FormikProvider value={formik}
        >
        <Form
        style = {{maxHeight: '600px'}}>
            <Stack direction="row" spacing={2} sx={{marginTop: 1, marginBottom: 1}} alignItems="flex-start">
                <TextField
                label="Name"
                variant="outlined"
                type="string"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                />
                <FormGroup>
                    <FormControlLabel
                    control={
                        <Switch
                        size="medium"
                        checked={formik.values.visible}
                        name="visible"
                        onChange={(event) => formik.setFieldValue('visible', event.target.checked)}
                        />
                    }
                    label="Visible?"
                    labelPlacement="top"
                    />
                </FormGroup>
            </Stack>
            <Divider />
            <Stack direction="row" spacing={2} sx={{marginTop: 2}} alignItems="flex-start">
                <CategoryAutocomplete
                value={formik.values.category}
                onValueChange={(newValue) => {
                    formik.setFieldValue(`category`, newValue);
                }}
                InputProps={{
                    name:`category`,
                    error: formik.touched?.category && Boolean(formik.errors?.category) ? true : false,
                    // @ts-ignore
                    helperText: formik.touched?.category && formik.errors?.category,
                }}
                />
            </Stack>
            <Stack direction="row" spacing={2} sx={{marginTop: 1, marginBottom: 2}} alignItems="flex-start">
            <TextField
                label="Description"
                variant="outlined"
                type="string"
                name="description"
                multiline
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                sx={{width: '100%'}}
            />
            </Stack>
        </Form>
        </FormikProvider>
        </DialogContent>
        <DialogActions sx={{margin: 1}}>
            <Button variant="outlined" onClick={props.onClose} color="secondary">Cancel</Button>
            <Button variant="contained" onClick={() => formik.submitForm()}>Create</Button>
        </DialogActions>
        </Dialog>
        </>
    )
};

export default ItemsAddDialog;