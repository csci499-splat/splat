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
import { ReportDialogProps } from '../pages/Reports';


const HistoryTest: Pickup[] = [
    {
    id: '2362353e-570b-477c-9c65-522c1487c848',
    weight:5,
    pickupStatus: PickupStatus.DISBURSED,
    canceledTime: new Date(),
    submittedAt: new Date(),
    studentInfo: {
        studentId: '1234567',
        age: 25,
        onMealPlan: true
    },
    /*householdInfo:{
        numSeniors:9,
        numAdults:5,
        numMinors:10,
    },*/
    itemRequests: [
        {
            item: {
                id: '12uffd-sddfd-343fddf',
                name: 'Test item',
                category: {
                    id: '123-fddd-3433fdf',
                    name: 'Test category',
                    limit: 4,
                    icon: 'test icon',
                    description: 'this is a test category',
                    visible: true,
                    createdAt: null,
                },
                categoryId: '123-666',
                description:'123',
                visible:true,
                createdAt:new Date(),    
            },
            quantity: 5,
        },
    ],
    requestedPickupTime: new Date(),
    otherNotes: 'Test notes',
},
{
    id: '353e-570b-477c-9c65-522c1487c848sdfsdfd',
    pickupStatus: PickupStatus.DISBURSED,
    submittedAt: new Date(),
    studentInfo: {
        studentId: '1234567',
        age: 25,
        onMealPlan: true
    },
    pickupTime: new Date(),
    itemRequests: [
        {
            item: {
                id: '12uffd-sddfd-343fddf',
                name: 'Test item',
                category: {
                    id: '123-fddd-3433fdf',
                    name: 'Test category',
                    limit: 4,
                    icon: 'test icon',
                    description: 'this is a test category',
                    visible: true,
                    createdAt: null,
                },
                categoryId: '123-fddd-3433fdf',
                description: 'this is a test item',
                visible: true,
                createdAt: null
            },
            quantity: 20,
        },
        {
            item: {
                id: '1jfd54745-fdhfd433-fdfdf',
                name: 'Test item 2',
                category: {
                    id: '123-fddd-3433fdf',
                    name: 'Test category',
                    limit: 4,
                    icon: 'test icon',
                    description: 'this is a test category',
                    visible: true,
                    createdAt: null,
                },
                categoryId: '123-fddd-3433fdf',
                description: 'this is a test item 2',
                visible: true,
                createdAt: null
            },
            quantity: 10,
        },
    ],
    weight: 10,
    requestedPickupTime: new Date(),
    otherNotes: 'Test notes',
},
];

interface HistoryDialogProps extends ReportDialogProps {

}

function Row(props: { row: Pickup }) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    const getStatusString = (status: PickupStatus): string => {
        switch(status) {
            case PickupStatus.PENDING:
                return "Pending fulfillment";
            case PickupStatus.WAITING:
                return "Waiting for pickup";
            case PickupStatus.DISBURSED:
                return "Disbursed to student";
            case PickupStatus.CANCELED:
                return "Canceled";
            default:
                return "None";
        }
    };

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">{row.id}</TableCell>
                <TableCell align="center">{row.itemRequests.length}</TableCell>
                <TableCell align="center">{row.requestedPickupTime.toLocaleString()}</TableCell>
                <TableCell align="center">{row.studentInfo.studentId}</TableCell>
                <TableCell align="center">{getStatusString(row.pickupStatus)}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" align="center">
                                Student information
                            </Typography>
                            <Table size="small" sx={{marginBottom: 2}}>
                                <TableHead>
                                    <TableCell align="left">Student Age</TableCell>
                                    {row.householdInfo && (
                                        <>
                                        <TableCell align="center"># Seniors</TableCell>
                                        <TableCell align="center"># Adults</TableCell>
                                        <TableCell align="center"># Minors</TableCell>
                                        </>
                                    )}
                                    <TableCell align="right">On Meal Plan?</TableCell>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="left">{row.studentInfo.age}</TableCell>
                                        {row.householdInfo && (
                                            <>
                                            <TableCell align="center">{row.householdInfo?.numSeniors}</TableCell>
                                            <TableCell align="center">{row.householdInfo?.numAdults}</TableCell>
                                            <TableCell align="center">{row.householdInfo?.numMinors}</TableCell>
                                            </>
                                        )}
                                        <TableCell align="right">{row.studentInfo.onMealPlan ? "Yes" : "No"}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <Typography variant="h6" align="center">
                                Pickup weight and times
                            </Typography>
                            <Table size="small" sx={{marginBottom: 2}}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">Submit Time</TableCell>
                                        <TableCell align="center">{row.pickupTime ? "Pickup Time" : "Cancel Time"}</TableCell>
                                        <TableCell align="center">Weight</TableCell>
                                        <TableCell align="center">Notes</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="left">{row.submittedAt?.toLocaleString()}</TableCell>
                                        <TableCell align="center">{row.pickupTime ? row.pickupTime?.toLocaleString() : 
                                            row.canceledTime?.toLocaleString()}
                                        </TableCell>
                                        <TableCell align="center">{row.weight?.toFixed(2) + ' lbs'}</TableCell>
                                        <TableCell align="center">{row.otherNotes}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <Typography variant="h6" align="center">
                                Items requested
                            </Typography>
                            <Table size="small" sx={{marginBottom: 2}}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">Item Category</TableCell>
                                        <TableCell align="center">Item Name</TableCell>
                                        <TableCell align="right">Quantity</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.itemRequests.map((item, index: number) => (
                                        <TableRow key={index}>
                                            <TableCell align="left">{item.item.category?.name}</TableCell>
                                            <TableCell align="center">{item.item.name}</TableCell>
                                            <TableCell align="right">{item.quantity}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

const HistoryDialog: FC<HistoryDialogProps> = (props:HistoryDialogProps) : ReactElement => {
    const [pickups, setPickups] = React.useState<Pickup[]>([]);

    const getPickups = async () => {
        //let res = await axios.get<Pickup[]>('/history');
        //setPickups(res.data);
        setPickups(HistoryTest);
    };

    React.useEffect(() => {
        getPickups();
    }, []);

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
        maxWidth="lg" 
        fullWidth
        >
            <DialogTitle>History</DialogTitle>
            <DialogContent>
                <div>
                    <TableContainer>
                        <Table sx={{ minWidth: 650 }} >
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
            <DialogActions sx={{ margin: 1 }}>
                <Button variant="outlined" onClick={props.onClose} color="secondary">Close</Button>
            </DialogActions>
        </Dialog>
        </>
    )
};

export default HistoryDialog; 