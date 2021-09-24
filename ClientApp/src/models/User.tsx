// Typescript models

type Category = {
    name: string;
    description: string;
    visible: string;
    maxItemsRequest: string;
    createdAt: string;

    knownFor: string[];
    
};

type Student = {
    studentId: string;
    age: string;
    onMealPlan: string;
    

    knownFor: string[];
};

type Item = {
    name: string;
    Category: string;
    description: string;
    visible: string;
    createdAt: string;

    knownFor: string[];
};

type ItemRequest = {
    name: string;
    quantity: string;

    knownFor: string[];
};

type Pickup = {
    Guid: string;
    Request: string;
    weight: string;
    PickupStatus: string;
    pickupTime: string;
    canceledTime: string;

    knownFor: string[];
};

enum PickupStatus {
    PENDING = "PENDING",
    WAITING = "WAITING",
    DISBURSED = "DISBURSED",
    CANCELED = "CANCELED",

};

type Donation = {
    Guid: string;
    value: string;
    weight: string;
    donor: string;
    donatedAt: string;

    knownFor: string[];
};