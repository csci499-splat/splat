import { Check } from '@mui/icons-material';
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import React, { FC, ReactElement } from 'react';

import { Pickup } from '../../../models/BackendTypes';
import { PickupStatus } from '../../../models/Pickup';
import { IPickupDialogProps } from '../pages/Pickups';

interface HistoryViewDetailsDialogProps extends IPickupDialogProps {
    
};