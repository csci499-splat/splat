import React, { FC, ReactElement } from 'react';
import { Pickup } from '../../../models/BackendTypes';
import { PickupStatus } from '../../../models/Pickup';
import { IPickupRow, IPickupDialogProps } from '../pages/Pickups';
import * as yup from 'yup';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button,
    Typography, TableContainer, TableRow, Table, TableCell, TableHead,
    TableBody, Checkbox, TextField, } from '@mui/material';
import { baseRequest } from '../../../services/api/genericRequest';
import { Form, FormikProvider, useFormik } from 'formik';

interface PickupFulfillDialogProps extends IPickupDialogProps {

};

const validationSchema = yup.object({
    weight: yup
    .number()
    .positive("Value must be positive")
    .required("Required"),
});

const PickupFulfillDialog: FC<PickupFulfillDialogProps> = (props: PickupFulfillDialogProps): ReactElement => {

    const initialValues = {
        weight: undefined,
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            await baseRequest.patch(`/pickups/${props.selectedPickup?.id}`,
                { weight: values.weight, status: PickupStatus.WAITING });
            props.onClose();
        }
    })

    const handleFulfill = async (id: string | undefined | null, newStatus: PickupStatus) => {
        if(id) await baseRequest.patch(`/pickups/${id}`, { status: newStatus });
        props.onClose();
    };

    return (
        <>
        <Dialog 
        open={props.open} 
        onClose={props.onClose}
        fullWidth
        >
        {props.selectedPickup?.status === PickupStatus.PENDING ? (
            <>
            <DialogTitle>
                Fulfill Request
            </DialogTitle>
            <DialogContent>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={4} align="center">Items</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell />
                                <TableCell>Item Name</TableCell>
                                <TableCell>Category Name</TableCell>
                                <TableCell align="right">Quantity</TableCell>
                            </TableRow>
                            {props.selectedPickup?.itemRequests.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Checkbox
                                        color="primary"
                                        />
                                    </TableCell>
                                    <TableCell>{row.item.name}</TableCell>
                                    <TableCell>{row.category?.name}</TableCell>
                                    <TableCell>{row.quantity}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <FormikProvider value={formik}>
                <Form>
                    <TextField
                    name="weight"
                    label="Weight"
                    variant="outlined"
                    type="number"
                    value={formik.values.weight}
                    onChange={formik.handleChange}
                    error={formik.touched.weight && Boolean(formik.errors.weight)}
                    helperText={formik.touched.weight && formik.errors.weight}
                    />
                </Form>
                </FormikProvider>
            </DialogContent>
            <DialogActions sx={{margin: 1}}>
                <Button variant="outlined" onClick={props.onClose} color="secondary">Cancel</Button>
                <Button variant="contained" onClick={() => formik.submitForm()} color="primary">
                    Fulfill
                </Button>
            </DialogActions>
            </>
        ) : (
            <>
            <DialogTitle>
                Student Picked Up
            </DialogTitle>
            <DialogContent>
                <Typography variant="h5">
                    Has the student picked up the order?
                </Typography>
            </DialogContent>
            <DialogActions sx={{margin: 1}}>
                <Button variant="outlined" onClick={props.onClose} color="primary">Cancel</Button>
                <Button variant="contained" onClick={() => handleFulfill(props.selectedPickup?.id, PickupStatus.DISBURSED)} color="success">
                    Confirm Picked Up
                </Button>
            </DialogActions>
            </>
        )}
        </Dialog>
        </>
    )

};

export default PickupFulfillDialog;
