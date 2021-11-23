import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import React, { FC, ReactElement } from 'react';

type ConfirmationDialogProps = {
    message: string;
    open: boolean;
    onClose: () => void;
    onConfirmAction: () => void;
    onCancelAction?: () => void;
    cancelText?: string;
    confirmText?: string;
}

const ConfirmationDialog: FC<ConfirmationDialogProps> = (props: ConfirmationDialogProps): ReactElement => {
    
    const handleCancel = () => {
        if(props.onCancelAction) props.onCancelAction();
        else props.onClose();
    };

    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>{props.message}</DialogTitle>
            <DialogActions sx={{ margin: 1 }}>
                <Button variant="outlined" onClick={handleCancel} color="secondary">{props.cancelText ? props.cancelText : "Cancel"}</Button>
                <Button variant="contained" onClick={props.onConfirmAction} color="warning">{props.confirmText ? props.confirmText : "Confirm"}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
