import { DateTimePicker } from '@mui/lab';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormControlLabel,
    FormGroup,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    Stack,
    Switch,
    TextField,
} from '@mui/material';
import { GridRowData } from '@mui/x-data-grid';
import { Form, FormikProvider, useFormik } from 'formik';
import React, { FC, ReactElement } from 'react';
import * as yup from 'yup';

import { CategoryIcons } from '../../../models/CategoryIcons';
import { baseRequest } from '../../../services/api/genericRequest';

type CategoriesEditDialogProps = {
    onClose: () => void;
    open: boolean;
    category?: GridRowData;
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
    limit: yup
    .number()
    .integer()
    .positive()
    .required(),
    visible: yup
    .boolean()
    .required("Required"),
    icon: yup
    .string()
    .required('Required'),
});

const CategoriesEditDialog: FC<CategoriesEditDialogProps> = (props: CategoriesEditDialogProps): ReactElement =>{

    const initialValues = (props.category) ? {
        id: props.category?.id,
        name: props.category?.name,
        description: props.category?.description,
        limit: props.category?.limit,
        visible: props.category?.visible,
        icon: props.category?.icon,
        createdAt: new Date(props.category?.createdAt),
    } : {

    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            console.log(values);
            await baseRequest.put(`/categories/${values.id}`, values);
            props.onClose();
        },
    });

    return (
        <>
        <Dialog 
        open={props.open} 
        onClose={props.onClose}
        >
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
        <FormikProvider value={formik}
        >
        <Form style = {{maxHeight: '600px'}}>
            <Stack direction="row" spacing={2} sx={{marginTop: 1, marginBottom: 2}} alignItems="flex-start">
                <TextField
                label="ID"
                variant="outlined"
                name="id"
                value={props.category?.id}
                disabled
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
                <TextField
                label="Limit"
                variant="outlined"
                type="number"
                name="limit"
                value={formik.values.limit}
                onChange={formik.handleChange}
                error={formik.touched.limit && Boolean(formik.errors.limit)}
                helperText={formik.touched.limit && formik.errors.limit}
                sx={{width: 100}}
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
                <TextField
                label="Description"
                variant="outlined"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                sx={{width: '100%'}}
                multiline
                />
                <FormControl sx={{width: 100}}>
                    <InputLabel id="icon-select">Icon</InputLabel>
                    <Select
                    labelId="icon-select"
                    name="icon"
                    value={formik.values.icon}
                    onChange={formik.handleChange}
                    error={formik.touched.icon && Boolean(formik.errors.icon)}
                    input={<OutlinedInput label="Icon" />}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {Object.entries(CategoryIcons).map((item, index) => (
                            <MenuItem value={item[0]} key={index}>
                                {item[1]}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <DateTimePicker
                renderInput={(props) =>
                <TextField
                {...props}
                />          
                }
                label="Created At"
                value={props.category?.createdAt}
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

export default CategoriesEditDialog;