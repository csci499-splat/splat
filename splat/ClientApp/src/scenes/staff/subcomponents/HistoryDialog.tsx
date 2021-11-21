import { Dialog, DialogContent, DialogActions, DialogTitle, Paper, 
    Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import React, { FC, ReactElement, useState } from 'react';
import { baseRequest } from '../../../services/api/genericRequest';
import { History } from '../../../models/History';
import { PickupStatus } from '../../../models/History';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TablePagination from '@mui/material/TablePagination';

type HistoryDialogProps = {
    open: boolean;
    onClose: () => void;
}



const HistoryDialog: FC<HistoryDialogProps> = (props:HistoryDialogProps) : ReactElement => {
    const [history, setHistory] = useState<History>();
    const getHistory = async () => {
        let res = await baseRequest.get<History> ('/history');
        setHistory(res.data);
    };
    React.useEffect(() => {
        getHistory();

    }, [])

    return(
        <>
        <Dialog
        open={props.open}
        onClose={props.onClose}
        >
            <DialogTitle>History</DialogTitle>
            <DialogContent>
                <div>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell />
                                    <TableCell align="center">Pickup ID</TableCell>
                                    <TableCell align="center"># Items</TableCell>
                                    <TableCell align="center">Requested Pickup Time</TableCell>
                                    <TableCell align="center">Student ID</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell />
                                    <TableCell align="center">{history?.id}</TableCell>
                                    <TableCell align="center">{history?.itemRequests.length}</TableCell>
                                    <TableCell align="center">{history?.requestedPickupTime}</TableCell>
                                    <TableCell align="center">{history?.studentInfo.studentId}</TableCell>
                                    <TableCell align="center">{history?.pickupStatus}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </DialogContent>
            
        </Dialog>
        </>
    )
};

export default HistoryDialog; 