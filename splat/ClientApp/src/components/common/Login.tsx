import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    InputAdornment,
    TextField
} from '@mui/material';
import { useFormik } from 'formik';
import React, { FC, ReactElement, useState } from 'react';
import * as yup from 'yup';

type LoginProps = {
    loginHandler: (email: string, password: string) => void,
    onClose: () => void,
}

const validationSchema = yup.object({
    email: yup
    .string()
    .email('Email must be valid')
    .required('Email address is required'),
    password: yup
    .string()
    .required('Password is required'),
});

const Login: FC<LoginProps> = (props: LoginProps): ReactElement => {

    const [passVisible, setPassVisible] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            props.loginHandler(values.email, values.password);
        },
    });

    return (
        <>
        <Dialog open={true} onClose={props.onClose}>
            <DialogTitle>Log in</DialogTitle>
            <DialogContent>
                <form onSubmit={formik.handleSubmit} style={{padding: 5}}>
                    <Divider />
                    <TextField 
                    id="email"
                    name="email"
                    label="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    sx={{display: 'block', width: '200px', marginTop: 3, marginBottom: 3}}
                    />
                    <TextField 
                    id="password"
                    name="password"
                    label="Password"
                    type={passVisible ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                onClick={() => setPassVisible(!passVisible)}
                                onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault()}
                                >
                                    {passVisible ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    sx={{display: 'block', margin: 0, width: '200px'}}
                    />
                </form>
            </DialogContent>
            <DialogActions sx={{margin: 1}}>
                <Button variant="outlined" onClick={props.onClose} color="secondary">Cancel</Button>
                <Button variant="contained" onClick={() => formik.submitForm()}>Log in</Button>
            </DialogActions>
        </Dialog>
        </>
    )

}

export default Login;
