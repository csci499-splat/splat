import React, { FC, ReactElement } from 'react';
import * as yup from 'yup';
import { Formik, Field, Form, FieldArray, FormikProvider, useFormik, useFormikContext } 
    from 'formik';
import { TextField, Stack, Dialog, DialogContent, 
    DialogActions, DialogTitle, InputAdornment, Button, } from '@mui/material';
import { DatePicker } from '@mui/lab';
import { Donation } from '../../../models/Donation';
import { requestNoAuth } from '../../../services/api/genericRequest';

type DonationAddFormProps = {
    open: boolean;
    onClose: () => void;
};

const initialValues: Donation = {
    id: null,
    monetaryValue: undefined,
    weight: undefined,
    donor: '',
    donatedAt: new Date(),
};

const validationSchema = yup.object({
    monetaryValue: yup
        .number()
        .positive()
        .test(
            'oneOfRequired',
            'Either value, weight, or both are required',
            function(item) {
                return this.parent.monetaryValue || this.parent.weight
            }
        ),
    weight: yup
        .number()
        .positive()
        .test(
            'oneOfRequired',
            'Either value, weight, or both are required',
            function(item) {
                return this.parent.monetaryValue || this.parent.weight
            }
        ),
    donor: yup
        .string()
        .max(50, 'Up to 50 characters max')
        .required('Required'),
    donatedAt: yup
        .date()
        .max(new Date())
        .required('Required'),
})

const DonationAddForm: FC<DonationAddFormProps> = (props: DonationAddFormProps): ReactElement => {

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            // TODO: change to Auth
            /* requestNoAuth('/donations', 'POST', {data: values})
                .then((res) => {
                    console.log(res);
                    props.onClose();
            }); */
        },
    });

    return (
        <>
        <Dialog
        open={props.open}
        onClose={props.onClose}
        >
            <DialogTitle>Add Donation</DialogTitle>
            <DialogContent>
            <FormikProvider value={formik}>
            <Form style={{maxHeight: '600px'}}>
                <Stack direction="row" spacing={2} sx={{marginTop: 1, marginBottom: 2}} alignItems="flex-start">
                    <TextField
                    label="Donor"
                    variant="outlined"
                    name="donor"
                    value={formik.values.donor}
                    onChange={formik.handleChange}
                    // @ts-ignore
                    error={formik.touched.donor && Boolean(formik.errors.donor)}
                    // @ts-ignore
                    helperText={formik.touched.donor && formik.errors.donor}
                    sx={{width: 300}}
                    />
                    <TextField
                    label="Value"
                    variant="outlined"
                    name="monetaryValue"
                    value={formik.values.monetaryValue}
                    onChange={formik.handleChange}
                    // @ts-ignore
                    error={formik.touched.monetaryValue && Boolean(formik.errors.monetaryValue)}
                    // @ts-ignore
                    helperText={formik.touched.monetaryValue && formik.errors.monetaryValue}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    sx={{width: 150}}
                    />
                </Stack>
                <Stack direction="row" spacing={2} sx={{marginTop: 1, marginBottom: 2}} alignItems="flex-start">
                    <DatePicker
                    renderInput={(props) => 
                        <TextField
                        {...props}
                        // @ts-ignore
                        error={formik.touched.donatedAt && Boolean(formik.errors.donatedAt)}
                        // @ts-ignore
                        helperText={formik.touched.donatedAt && formik.errors.donatedAt}
                        sx={{width: 300}}
                        />
                    }
                    label="Donation Date"
                    value={formik.values.donatedAt}
                    maxDate={new Date()}
                    onChange={(newValue) => {
                        formik.setFieldValue("donatedAt", newValue);
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

export default DonationAddForm;