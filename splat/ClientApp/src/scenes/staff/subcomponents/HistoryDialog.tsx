import { Dialog, DialogContent, DialogActions, DialogTitle, Paper, 
    Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import React, { FC, ReactElement, useState } from 'react';
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
import { useTheme } from '@mui/material/styles';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import TableFooter from '@mui/material/TableFooter';
import axios, { AxiosResponse } from 'axios';

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
                <TableCell align="center">{new Date(row.requestedPickupTime).toLocaleString()}</TableCell>
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
                                        <TableCell align="left">{
                                            // @ts-ignore
                                            new Date(row.submittedAt)
                                            .toLocaleString()}
                                        </TableCell>
                                        <TableCell align="center">{row.pickupTime ? new Date(row.pickupTime).toLocaleString() : 
                                            // @ts-ignore
                                            new Date(row.canceledTime)
                                            .toLocaleString()}
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

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
      event: React.MouseEvent<HTMLButtonElement>,
      newPage: number,
    ) => void;
  }
  
  function TablePaginationActions(props: TablePaginationActionsProps) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;
  
    const handleFirstPageButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>,
    ) => {
      onPageChange(event, 0);
    };
  
    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, page - 1);
    };
  
    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, page + 1);
    };
  
    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
  
    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    );
  }

const HistoryDialog: FC<HistoryDialogProps> = (props:HistoryDialogProps) : ReactElement => {
    const [pickups, setPickups] = React.useState<Pickup[]>([]);


    
    const getPickups = async (start: Date, end: Date) => {
        try {
            let res = await axios.get<Pickup[]>('/pickups/history', {
                params: {
                    dateFrom: start.toISOString(),
                    dateTo: end.toISOString(),
                }
            });
            setPickups(res.data);
        } catch(err) {

        }
        
    };

    React.useEffect(() => {
        if(Boolean(props.startDateValue) && Boolean(props.endDateValue) && props.open) {
            // @ts-ignore
            getPickups(props.startDateValue, props.endDateValue);
        }
    }, [props.open]);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
  

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
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
                                {(rowsPerPage > 0
                                    ? pickups.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : pickups
                                ).map((row) => (
                                    <Row key={row.id} row={row} />
                                ))}
                            </TableBody>
                            <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={pickups.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
                        </Table>
                    </TableContainer>
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