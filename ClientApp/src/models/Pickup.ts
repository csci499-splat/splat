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
    PENDING = "PENDING",
    WAITING = "WAITING",
    DISBURSED = "DISBURSED",
    CANCLED = "CANCELED"
};
