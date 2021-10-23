import { DatePicker } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import React, { FC, ReactElement } from 'react';
import * as yup from 'yup';

import { UserRoles } from '../../../models/User';
import { baseRequest } from '../../../services/api/genericRequest';

type UserAddFormProps = {
    open: boolean;
    onClose: () => void;
    changeRole: (email: string, newRole: string) => Promise<void>;
};

const initialValues = {
    email: "",
    role: "",
};

const validationSchema = yup.object({
    email: yup
    .string()
    .email("Invalid email")
    .required("Required"),
    role: yup
    .string()
    .oneOf(['Administrator', 'Staff'], "Must be a valid role")
    .required("Required"),
})

const UserAddForm: FC<UserAddFormProps> = (props: UserAddFormProps): ReactElement => {

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                await props.changeRole(values.email, values.role);
                props.onClose();
            } catch(error) {

            }
            
        },
    });

    return (
        <>
        <Dialog
        open={props.open}
        onClose={props.onClose}
        >
            <DialogTitle>Add Staff Member or Administrator</DialogTitle>
            <DialogContent>
            <FormikProvider value={formik}>
            <Form style={{maxHeight: '600px'}}>
                <Stack direction="row" spacing={2} sx={{marginTop: 1, marginBottom: 0}} alignItems="flex-start">
                    <TextField
                    label="Email"
                    variant="outlined"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    // @ts-ignore
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    // @ts-ignore
                    helperText={formik.touched.email && formik.errors.email}
                    sx={{ width: 300 }}
                    />
                    <FormControl 
                    sx={{ m: 1, width: 150 }}
                    error={formik.touched.role && Boolean(formik.errors.role)}
                    >
                        <InputLabel id="select-role">Role</InputLabel>
                        <Select
                        labelId="select-role"
                        value={formik.values.role}
                        label="Role"
                        name="role"
                        onChange={formik.handleChange}
                        >
                            <MenuItem value="None">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="Staff">Staff</MenuItem>
                            <MenuItem value="Administrator">Administrator</MenuItem>
                        </Select>
                        <FormHelperText>{formik.touched.role && formik.errors.role}</FormHelperText>
                    </FormControl>
                </Stack>
            </Form>
            </FormikProvider>
            </DialogContent>
            <DialogActions sx={{margin: 1}}>
                <Button variant="outlined" onClick={props.onClose} color="secondary">Cancel</Button>
                <Button variant="contained" onClick={() => formik.submitForm()}>Add</Button>
            </DialogActions>
        </Dialog>
        </>
    )

};

export default UserAddForm;