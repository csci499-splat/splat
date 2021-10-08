import React, { FC, ReactElement } from 'react';
import * as yup from 'yup';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button,
    Table, TableBody, TableCell, TableContainer, TableRow, TableHead,
    Collapse, IconButton, Typography, Paper, Box, CircularProgress, Checkbox } from '@mui/material';
import { Check, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { fetchResourceAuth } from '../../services/api/genericRequest';
import { Pickup } from '../../models/BackendTypes';
import { PickupStatus } from '../../models/Pickup';
import { boolean } from 'yup/lib/locale';

interface PickupViewTableProps {
    id: string | undefined;
    showCheckboxes?: boolean;
};

const PickupViewTable: FC<PickupViewTableProps> = (props: PickupViewTableProps): ReactElement => {

    const [pickupData, setPickupData] = React.useState<Pickup>();
    const [itemsChecked, setItemsChecked] = React.useState<boolean[]>([]);

    const handleItemChecked = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
        // set id'th item to event.target.checked
        const updatedChecked: boolean[] = itemsChecked.map((item, ind) => 
            ind === id ? event.target.checked : item);
        setItemsChecked(updatedChecked);
    };

    React.useEffect(() => {
        const fetchData = async () => {
            let testObj: Pickup = {
                id: '2362353e-570b-477c-9c65-522c1487c848',
                pickupStatus: PickupStatus.WAITING,
                submittedAt: new Date().toLocaleString(),
                studentInfo: {
                    studentId: '1234567',
                    age: 25,
                    onMealPlan: true
                },
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
                            description: 'this is a test item',
                            visible: true,
                            createdAt: null
                        },
                        quantity: 5,
                    },
                ],
                requestedPickupTime: new Date(),
                otherNotes: 'Test notes',
            };
            setPickupData(testObj);
            let checkedArr: boolean[] = [];
            for(let i: number = 0; i < testObj.itemRequests.length; i++)
                checkedArr.push(false);
            setItemsChecked(checkedArr);
            //let res = await fetchResourceAuth<Pickup>(`/pickup/${props.selectedPickup?.id}`);
            //setPickupData(res.data);
        };
        
        fetchData();
    }, []);

    return (
    <>
    {pickupData !== undefined ? (
    <TableContainer component={Paper}>
        <Table sx={{width: '100%'}}>
            <TableHead>
                <TableRow>
                    <TableCell align="left">
                        Pickup ID
                    </TableCell>
                    <TableCell align="left">
                        Submitted At
                    </TableCell>
                    <TableCell align="center">
                        Status
                    </TableCell>
                    <TableCell align="right">
                        Requested Pickup Time
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell align="left">
                        {pickupData.id}
                    </TableCell>
                    <TableCell align="left">
                        {pickupData.submittedAt}
                    </TableCell>
                    <TableCell align="center">
                        {pickupData.pickupStatus}
                    </TableCell>
                    <TableCell align="right">
                        {pickupData.requestedPickupTime.toLocaleString()}
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
                        {pickupData.studentInfo.studentId}
                    </TableCell>
                    <TableCell>
                        {pickupData.studentInfo.age}
                    </TableCell>
                    <TableCell>
                        {pickupData.studentInfo.onMealPlan ? <Check /> : <></>}
                    </TableCell>
                </TableRow>
                {pickupData.householdInfo ? (
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
                            {pickupData.householdInfo.numMinors}
                        </TableCell>
                        <TableCell>
                            {pickupData.householdInfo.numAdults}
                        </TableCell>
                        <TableCell>
                            {pickupData.householdInfo.numSeniors}
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
                    {props.showCheckboxes && (
                        <TableCell>
                            Item Collected
                        </TableCell>
                    )}
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
                {pickupData.itemRequests.map((item, index: number) => (
                <TableRow key={index}>
                    {props.showCheckboxes && (
                    <TableCell>
                        <Checkbox checked={itemsChecked[index]} onChange={(event) => handleItemChecked(event, index)} />
                    </TableCell>
                    )}
                    <TableCell>
                        {item.item.category.name}
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
                        {pickupData.pickupTime ? pickupData.pickupTime : 'N/A'}
                    </TableCell>
                    <TableCell>
                        {pickupData.canceledTime ? pickupData.canceledTime : 'N/A'}
                    </TableCell>
                    <TableCell>
                        {pickupData.weight ? pickupData.weight : 'N/A'}
                    </TableCell>
                    <TableCell>
                        {pickupData.otherNotes === '' ? pickupData.otherNotes : 'No notes'}
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </TableContainer>
    ) : (
        <>
        <h4>Loading...</h4>
        <CircularProgress />
        </>
    )}
    </>
    );
};

export default PickupViewTable;
