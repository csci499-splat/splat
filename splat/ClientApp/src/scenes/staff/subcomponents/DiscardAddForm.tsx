import { DatePicker } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, Stack, TextField } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import React, { FC, ReactElement } from 'react';
import * as yup from 'yup';

import { Discard } from '../../../models/Discard';
import { authRequest } from '../../../services/api/genericRequest';

type DiscardAddFormProps = {
    open: boolean;
    onClose: () => void;
};

const initialValues: Discard = {
    weight: 0,
    discardedAt: new Date(),
};

const validationSchema = yup.object({
    weight: yup
    .number()
    .positive()
    .required("Required"),
    discardedAt: yup
    .date()
    .max(new Date())
    .required('Required'),
})

const DiscardAddForm: FC<DiscardAddFormProps> = (props: DiscardAddFormProps): ReactElement => {

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            // TODO: change to Auth
            await authRequest.post<Discard>('/discards', values);
            props.onClose();
        },
    });

    return (
        <>
        <Dialog
        open={props.open}
        onClose={props.onClose}
        >
            <DialogTitle>Discard Items</DialogTitle>
            <DialogContent>
            <FormikProvider value={formik}>
            <Form style={{maxHeight: '600px'}}>
                <Stack direction="row" spacing={2} sx={{marginTop: 1, marginBottom: 2}} alignItems="flex-start">
                    <DatePicker
                    renderInput={(props) =>
                        <TextField
                        {...props}
                        // @ts-ignore
                        error={formik.touched.discardedAt && Boolean(formik.errors.discardedAt)}
                        // @ts-ignore
                        helperText={formik.touched.discardedAt && formik.errors.discardedAt}
                        sx={{width: 300}}
                        />
                    }
                    label="Discard Date"
                    value={formik.values.discardedAt}
                    maxDate={new Date()}
                    onChange={(newValue) => {
                        formik.setFieldValue("discardedAt", newValue);
                    }}
                    showTodayButton
                    clearable
                    />
                    <TextField
                    label="Weight"
                    variant="outlined"
                    name="weight"
                    value={formik.values.weight}
                    onChange={formik.handleChange}
                    // @ts-ignore
                    error={formik.touched.weight && Boolean(formik.errors.weight)}
                    // @ts-ignore
                    helperText={formik.touched.weight && formik.errors.weight}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">lb</InputAdornment>,
                    }}
                    sx={{width: 150}}
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

export default DiscardAddForm;