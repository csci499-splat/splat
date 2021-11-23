import { Dialog, DialogContent, DialogActions, DialogTitle, Paper, 
    Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import React, { FC, ReactElement, useState } from 'react';
import { baseRequest } from '../../../services/api/genericRequest';
import { Pickup, PickupStatus } from '../../../models/Pickup';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TablePagination from '@mui/material/TablePagination';
import Pickups from '../pages/Pickups';



type HistoryDialogProps = {
    open: boolean;
    onClose: () => void;
}

function Row(props: { row: Pickup}) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell align="center">{row.id}</TableCell>
                <TableCell align="center">{row.itemRequests.length}</TableCell>
                <TableCell align="center">{row.requestedPickupTime}</TableCell>
                <TableCell align="center">{row.studentInfo.studentId}</TableCell>
                <TableCell align="center">{row.pickupStatus}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Table size="small" aria-label="information">
                                <TableHead>
                                    <TableCell align="center">Student Age</TableCell>
                                    <TableCell align="center">Meal Plan</TableCell>
                                    <TableCell align="center"># Seniors</TableCell>
                                    <TableCell align="center"># Adults</TableCell>
                                    <TableCell align="center"># Minors</TableCell>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="center">{row.studentInfo.age}</TableCell>
                                        <TableCell align="center">{row.studentInfo.onMealPlan}</TableCell>
                                        <TableCell align="center">{row.householdInfo?.numSeniors}</TableCell>
                                        <TableCell align="center">{row.householdInfo?.numAdults}</TableCell>
                                        <TableCell align="center">{row.householdInfo?.numMinors}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="center">Submit Time</TableCell>
                                        <TableCell align="center">{row.pickupTime?("Pickup Time"):("Cancel Time")}</TableCell>
                                        <TableCell align="center">Weight</TableCell>
                                        <TableCell align="center">Note</TableCell>
                                    </TableRow>
                                    {row.itemRequests.map((item, index: number) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.item.category?.name}</TableCell>
                                            <TableCell>{item.item.name}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
}

const HistoryDialog: FC<HistoryDialogProps> = (props:HistoryDialogProps) : ReactElement => {
    const [pickups, setPickups] = React.useState<Pickup[]>([]);
    const getPickups = async () => {
        let res = await baseRequest.get<Pickup[]>('/history');
        setPickups(res.data);
    }

    React.useEffect(() => {
        getPickups();
    });

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

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
                                {pickups.map((row) => (
                                    <Row key={row.id} row={row} />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={pickups.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </div>
            </DialogContent>
            
        </Dialog>
        </>
    )
};

export default HistoryDialog; 