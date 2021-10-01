import ItemRequest from './ItemRequest';
import StudentInto from './Student';
import HouseholdInfo from './HouseholdInfo';

export type Pickup = {
    id: string | null;
    weight?: number;
    pickupStatus: PickupStatus;
    pickupTime?: string;
    canceledTime?: string;
    submittedAt: string | null;
    studentInfo: StudentInto;
    householdInfo?: HouseholdInfo;
    itemRequests: ItemRequest[];
    requestedPickupTime: string;
    otherNotes: string;
};

export enum PickupStatus {
    PENDING = 0,
    WAITING = 1,
    DISBURSED = 2,
    CANCELED = 3,
};

export const getStatusString = (status: PickupStatus): string => {
    switch(status) {
        case PickupStatus.PENDING:
            return "Pending";
        case PickupStatus.WAITING:
            return "Waiting";
        case PickupStatus.DISBURSED:
            return "Disbursed";
        case PickupStatus.CANCELED:
            return "Canceled";
        default:
            return "None";
    }
};
