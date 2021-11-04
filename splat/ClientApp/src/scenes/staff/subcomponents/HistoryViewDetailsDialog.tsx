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

import { History} from '../../../models/History';
import { IHistoryDialogProps } from '../pages/History';
import { baseRequest } from '../../../services/api/genericRequest';

interface HistoryViewDetailsDialogProps extends IHistoryDialogProps {
    
};

const HistoryViewDetailsDialog: FC<HistoryViewDetailsDialogProps> = (props: HistoryViewDetailsDialogProps): ReactElement => {
    
    const [historyData, setHistoryData] = React.useState<History>();

    const getHistoryData = async () => {
        let res = await baseRequest.get<History> ('/history');
        setHistoryData(res.data);
    };

    React.useEffect(() => {
        getHistoryData();
    },[])

    return (
        <>
        <Dialog
        open={props.open}
        onClose={props.onClose}
        maxWidth="lg"
        fullWidth>
            <DialogTitle>View Details</DialogTitle>
            <DialogContent>
            {historyData !== undefined ? (
            <TableContainer component={Paper}>
                <Table sx={{width: '100%'}}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">
                                History ID
                            </TableCell>
                            <TableCell align="left">
                                Submitted At
                            </TableCell>
                            <TableCell align="left">
                                Status
                            </TableCell>
                            <TableCell align="left">
                                Requested Pickup Time
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell align="left">
                                {historyData.id}
                            </TableCell>
                            <TableCell align="left">
                                {historyData.submittedAt}
                            </TableCell>
                            <TableCell align="left">
                                {historyData.pickupStatus}
                            </TableCell>
                            <TableCell align="left">
                                {historyData.requestedPickupTime.toLocaleString()}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                Student ID
                            </TableCell>
                            <TableCell>
                                Student Age
                            </TableCell>
                            <TableCell>
                                On Meal Plan
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                {historyData.studentInfo.studentId}
                            </TableCell>
                            <TableCell>
                                {historyData.studentInfo.age}
                            </TableCell>
                            <TableCell>
                                {historyData.studentInfo.onMealPlan ? <Check /> : <></>}
                            </TableCell>
                        </TableRow>
                        {historyData.householdInfo ? (
                            <>
                            <TableRow>
                                <TableCell>
                                    # of Minors (Up to 17)
                                </TableCell>
                                <TableCell>
                                    # of Adults (18 to 64)
                                </TableCell>
                                <TableCell>
                                    # of Seniors (65+)
                                </TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>
                                    {historyData.householdInfo.numMinors}
                                </TableCell>
                                <TableCell>
                                    {historyData.householdInfo.numAdults}
                                </TableCell>
                                <TableCell>
                                    {historyData.householdInfo.numSeniors}
                                </TableCell>
                            </TableRow>
                            </>
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No household data
                                </TableCell>
                            </TableRow>
                        )}
                        <TableRow>
                            <TableCell>
                                Category
                            </TableCell>
                            <TableCell>
                                Item
                            </TableCell>
                            <TableCell>
                                Quantity
                            </TableCell>
                        </TableRow>
                        {historyData.itemRequests.map((item, index: number) => (
                        <TableRow key={index}>
                            <TableCell>
                                {item.item.category?.name}
                            </TableCell>
                            <TableCell>
                                {item.item.name}
                            </TableCell>
                            <TableCell>
                                {item.quantity}
                            </TableCell>
                        </TableRow>
                        ))}
                        <TableRow>
                            <TableCell>
                                Pickup Time
                            </TableCell>
                            <TableCell>
                                Canceled At
                            </TableCell>
                            <TableCell>
                                Weight
                            </TableCell>
                            <TableCell>
                                Other Notes
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                {historyData.pickupTime ? historyData.pickupTime : 'N/A'}
                            </TableCell>
                            <TableCell>
                                {historyData.canceledTime ? historyData.canceledTime : 'N/A'}
                            </TableCell>
                            <TableCell>
                                {historyData.weight ? historyData.weight : 'N/A'}
                            </TableCell>
                            <TableCell>
                                {historyData.otherNotes === '' ? historyData.otherNotes : 'No notes'}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            ): (
                <>
                <h4>Loading...</h4>
                <CircularProgress />
                </>
            )}
            </DialogContent>
            <DialogActions sx={{margin: 1}}>
                <Button variant="outlined" onClick={props.onClose} color="primary">Close</Button>
            </DialogActions>
        </Dialog>
        </>
    )
}

export default HistoryViewDetailsDialog;
