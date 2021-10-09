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

type ItemsAddDialogProps = {
    onClose: () => void,
    open: boolean;
    item?: GridRowData;
}



const validationSchema = yup.object({   
    name: yup.string()
    .max(25, ({ max }) => `Name can't be more than ${max} characters long`)
    .required("Name is required"),
    description: yup.string()
    .max(250, ({ max }) => `Description can't be more than ${max} characters long`)
    .required("Description is required"),
    category: yup.object().shape({
        id: yup.string().nullable()
        .required(),
        name: yup.string()
        .required(),
        description: yup.string()
        .required(),
        }).nullable().required('Category is required'),
        visible: yup.boolean().required("Required"),
});

const ItemsAddDialog: FC<ItemsAddDialogProps> = (props: ItemsAddDialogProps): ReactElement =>{

    const initialValues: Item ={
        id: props.item?.id,
        name: props.item?.name,
        category: {
            id: props.item?.category.id,
            name: props.item?.category.name,
            description: props.item?.category.description,
            limit: props.item?.category.limit,
            icon: props.item?.category.icon,
            visible: props.item?.category.visible,
            createdAt: props.item?.category.createAt,
        },
        description: props.item?.description,
        visible: props.item?.visible,
        createdAt: props.item?.createAt,
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            console.log(values);
            props.onClose();
        },
    });
    return(
        <>
        <Dialog 
        open={props.open} 
        onClose={props.onClose}
        maxWidth="lg" 
        fullWidth
        >
        <DialogTitle>New Item</DialogTitle>
        <DialogContent>
        <FormikProvider value={formik}
        >
        <Form
        style = {{maxHeight: '600px'}}>
            <Stack direction="row" spacing={2} sx={{marginTop: 1, marginBottom: 2}} alignItems="flex-start">
                <TextField
                label="Item ID"
                variant="outlined"
                name="id"
                type="string"
                disabled
                value={formik.values.id}
                onChange={formik.handleChange}
                error={formik.touched.id && Boolean(formik.errors.id)}
                helperText={formik.touched.id && formik.errors.id}
                />
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
                        onChange={formik.handleChange}
                        />
                    }
                    label="Visible?"
                    labelPlacement="top"
                    />
                </FormGroup>
            </Stack>
            <Divider />
            <Grid item xs={3}>
                <CategoryAutocomplete
                value={formik.values.category}
                onValueChange={(newValue) => {
                    formik.setFieldValue(`category`, newValue);
                }}
                InputProps={{
                    name:`category`,
                    error: (formik.errors.category && formik.touched.category)  && Boolean((formik.errors?.category)) ? true : false,
                    helperText: (formik.errors.category && formik.touched.category) && String(formik.errors?.category) ? '':'',
                }}
                />
            </Grid>
            <TextField
                label="Description"
                variant="outlined"
                type="string"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
            />
            <DateTimePicker
            renderInput={(props) =>
            <TextField
            {...props}
            error={formik.touched.createdAt && Boolean(formik.errors.createdAt)}
            helperText={formik.touched.createdAt && formik.errors.createdAt}
            />          
            }
            label="Create At"
            value={formik.values.createdAt}
            onChange={(newValue) => {
                formik.setFieldValue("createAt", newValue);
                formik.setFieldTouched("createAt", true);
            }}
            disabled
            ampm
            ampmInClock
            />
        </Form>
        </FormikProvider>
        </DialogContent>
        <DialogActions sx={{margin:1}}>
            <Button variant="outlined" onClick={props.onClose} color="secondary">Cancel</Button>
            <Button variant="contained" onClick={() => formik.submitForm()}>Submit</Button>
        </DialogActions>
        </Dialog>
        </>
    )
};

export default ItemsAddDialog;