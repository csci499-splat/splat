import React, { FC, ReactElement } from 'react';
import * as yup from 'yup';
import { Formik, Field, Form, FieldArray, FormikProvider, useFormik, useFormikContext } from 'formik';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, 
    DialogTitle, Stack,
    Grid, IconButton, TextField, Tooltip, Zoom, Divider, FormGroup, FormControlLabel, Switch } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import CategoryAutocomplete from '../../student/CategoryAutocomplete';
import type {Item, Category, ItemRequest, Pickup, StudentInfo, HouseholdInfo} from '../../../models/BackendTypes'
import { DateTimePicker } from '@mui/lab';
import { GridRowData } from '@mui/x-data-grid';
import { baseRequest } from '../../../services/api/genericRequest';

type ItemsEditDialogProps = {
    onClose: () => void,
    item?: GridRowData;
    open: boolean;
}

const validationSchema = yup.object({   
    name: yup
    .string()
    .max(25, ({ max }) => `Name can't be more than ${max} characters long`)
    .required("Name is required"),
    description: yup
    .string()
    .max(250, ({ max }) => `Description can't be more than ${max} characters long`)
    .required("Description is required"),
    category: yup
    .object().
    shape({
        id: yup
        .string()
        .nullable()
        .required(),
        name: yup
        .string()
        .required(),
        description: yup
        .string()
        .required(),
    })
    .nullable()
    .required('Category is required'),
    visible: yup
    .boolean()
    .required("Required"),
});

const ItemsEditDialog: FC<ItemsEditDialogProps> = (props: ItemsEditDialogProps): ReactElement => {

    let initialValues = (props.item) ? {
        id: props.item?.id,
        name: props.item?.name,
        categoryId: props.item?.category.id,
        category: {
            id: props.item?.category.id,
            name: props.item?.category.name,
            description: props.item?.category.description,
            limit: props.item?.category.limit,
            icon: props.item?.category.icon,
            visible: props.item?.category.visible,
            createdAt: new Date(props.item?.category.createdAt),
        },
        description: props.item?.description,
        visible: props.item?.visible,
        createdAt: new Date(props.item?.createdAt),
    } : {

    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            await baseRequest.put(`/items/${values.id}`, values);
            props.onClose();
        },
    });
    
    return (
        <>
        <Dialog 
        open={props.open} 
        onClose={props.onClose}
        >
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
        <FormikProvider value={formik}>
        <Form style={{maxHeight: '600px'}}>
            <Stack direction="row" spacing={2} sx={{marginTop: 1, marginBottom: 2}} alignItems="flex-start">
                <TextField
                label="ID"
                variant="outlined"
                name="id"
                disabled
                value={props.item?.id}
                />
                <TextField
                label="Name"
                variant="outlined"
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
            <Stack direction="row" spacing={2} sx={{marginTop: 1, marginBottom: 2}} alignItems="flex-start">
                <CategoryAutocomplete
                value={formik.values.category}
                onValueChange={(newValue) => {
                    formik.setFieldValue(`category`, newValue);
                    formik.setFieldValue('categoryId', newValue?.id);
                }}
                InputProps={{
                    name:`category`,
                    error: (formik.errors.category && formik.touched.category)  && Boolean((formik.errors?.category)) ? true : false,
                    helperText: (formik.errors.category && formik.touched.category) && String(formik.errors?.category) ? '':'',
                }}
                />
                <TextField
                label="Description"
                variant="outlined"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                multiline
                />
                <DateTimePicker
                renderInput={(props) =>
                <TextField
                {...props}
                />          
                }
                label="Created At"
                value={props.item?.createdAt}
                onChange={(newValue) => {
                }}
                disabled
                ampm
                ampmInClock
                />
            </Stack>
        </Form>
        </FormikProvider>
        </DialogContent>
        <DialogActions sx={{margin:1}}>
            <Button variant="outlined" onClick={props.onClose} color="secondary">Cancel</Button>
            <Button variant="contained" onClick={() => formik.submitForm()}>Edit</Button>
        </DialogActions>
        </Dialog>
        </>
    )
};

export default ItemsEditDialog;