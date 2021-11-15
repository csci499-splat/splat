import { Dialog, DialogContent, DialogActions, DialogTitle, Paper, 
    Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import React, { FC, ReactElement, useState } from 'react';
import { baseRequest } from '../../../services/api/genericRequest';
import {History} from '../../../models/History';

type HistoryDialogProps = {
    open: boolean;
    onClose: () => void;
}

const HistoryDialog: FC<HistoryDialogProps> = (props:HistoryDialogProps) : ReactElement => {


    return(
        <>
        </>
    )
};

export default HistoryDialog; 