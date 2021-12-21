using splat.Models;
using System;

namespace splat.Tests
{
    public static class TestPickups
    {
        public const int NUM_TEST_PICKUPS = 16;

        public static readonly Pickup P0 = new Pickup
        {
            Id = Guid.NewGuid(),
            PickupStatus = PickupStatus.DISBURSED,
            StudentInfo = TestStudents.Alice,
            ItemRequests = new ItemRequest[]
            {
                new ItemRequest
                {
                    Item = TestItems.Beans,
                    Quantity = 5
                },
                new ItemRequest
                {
                    Item = TestItems.Spam,
                    Quantity = 11
                },
                new ItemRequest
                {
                    Item = TestItems.Bread,
                    Quantity = 2
                },
            },
            SubmittedAt = new DateTime(2021, 1, 13, 12, 0, 0)
        };

        public static readonly Pickup P1 = new Pickup
        {
            Id = Guid.NewGuid(),
            PickupStatus = PickupStatus.PENDING,
            StudentInfo = TestStudents.Bob,
            ItemRequests = new ItemRequest[]
            {
                new ItemRequest
                {
                    Item = TestItems.Tuna,
                    Quantity = 3
                },
                new ItemRequest
                {
                    Item = TestItems.Spam,
                    Quantity = 11
                },
                new ItemRequest
                {
                    Item = TestItems.Bread,
                    Quantity = 2
                },
            },
            SubmittedAt = new DateTime(2021, 1, 14, 12, 0, 0)
        };

        public static readonly Pickup P2 = new Pickup
        {
            Id = Guid.NewGuid(),
            PickupStatus = PickupStatus.CANCELED,
            StudentInfo = TestStudents.Bob,
            ItemRequests = new ItemRequest[]
            {
                new ItemRequest
                {
                    Item = TestItems.Carrots,
                    Quantity = 3
                },
                new ItemRequest
                {
                    Item = TestItems.Spam,
                    Quantity = 20
                },
                new ItemRequest
                {
                    Item = TestItems.Bread,
                    Quantity = 5
                },
            },
            SubmittedAt = new DateTime(2021, 1, 16, 12, 0, 0)
        };

        public static readonly Pickup P3 = new Pickup
        {
            Id = Guid.NewGuid(),
            PickupStatus = PickupStatus.CANCELED,
            StudentInfo = TestStudents.Carter,
            ItemRequests = new ItemRequest[]
            {
                new ItemRequest
                {
                    Item = TestItems.Carrots,
                    Quantity = 3
                },
                new ItemRequest
                {
                    Item = TestItems.Spam,
                    Quantity = 2
                },
                new ItemRequest
                {
                    Item = TestItems.Beans,
                    Quantity = 19
                },
                new ItemRequest
                {
                    Item = TestItems.Soup,
                    Quantity = 7
                }
            },
            SubmittedAt = new DateTime(2021, 1, 19, 12, 0, 0)
        };

        public static readonly Pickup P4 = new Pickup
        {
            Id = Guid.NewGuid(),
            PickupStatus = PickupStatus.CANCELED,
            StudentInfo = TestStudents.Frank,
            ItemRequests = new ItemRequest[]
            {
                new ItemRequest
                {
                    Item = TestItems.Carrots,
                    Quantity = 15
                },
            },
            SubmittedAt = new DateTime(2021, 2, 6, 12, 0, 0)
        };

        public static readonly Pickup P5 = new Pickup
        {
            Id = Guid.NewGuid(),
            PickupStatus = PickupStatus.CANCELED,
            StudentInfo = TestStudents.Frank,
            ItemRequests = new ItemRequest[]
            {
                new ItemRequest
                {
                    Item = TestItems.Beans,
                    Quantity = 11
                },
                new ItemRequest
                {
                    Item = TestItems.Tuna,
                    Quantity = 2
                }
            },
            SubmittedAt = new DateTime(2021, 2, 10, 12, 0, 0)
        };

        public static readonly Pickup P6 = new Pickup
        {
            Id = Guid.NewGuid(),
            PickupStatus = PickupStatus.CANCELED,
            StudentInfo = TestStudents.Frank,
            ItemRequests = new ItemRequest[]
            {
                new ItemRequest
                {
                    Item = TestItems.Carrots,
                    Quantity = 15
                },
                new ItemRequest
                {
                    Item = TestItems.Beans,
                    Quantity = 5
                },
                new ItemRequest
                {
                    Item = TestItems.Bread,
                    Quantity = 6
                },
                new ItemRequest
                {
                    Item = TestItems.Spam,
                    Quantity = 15
                },
            },
            SubmittedAt = new DateTime(2021, 2, 15, 12, 0, 0)
        };

        public static readonly Pickup P7 = new Pickup
        {
            Id = Guid.NewGuid(),
            PickupStatus = PickupStatus.CANCELED,
            StudentInfo = TestStudents.Erin,
            ItemRequests = new ItemRequest[]
            {
                new ItemRequest
                {
                    Item = TestItems.Carrots,
                    Quantity = 1
                },
                new ItemRequest
                {
                    Item = TestItems.Beans,
                    Quantity = 8
                },
                new ItemRequest
                {
                    Item = TestItems.Spam,
                    Quantity = 18
                },
            },
            SubmittedAt = new DateTime(2021, 2, 20, 12, 0, 0)
        };

        public static readonly Pickup P8 = new Pickup
        {
            Id = Guid.NewGuid(),
            PickupStatus = PickupStatus.CANCELED,
            StudentInfo = TestStudents.Erin,
            ItemRequests = new ItemRequest[]
            {
                new ItemRequest
                {
                    Item = TestItems.Carrots,
                    Quantity = 11
                },
                new ItemRequest
                {
                    Item = TestItems.Beans,
                    Quantity = 20
                },
                new ItemRequest
                {
                    Item = TestItems.Spam,
                    Quantity = 11
                },
            },
            SubmittedAt = new DateTime(2021, 2, 27, 12, 0, 0)
        };

        public static readonly Pickup P9 = new Pickup
        {
            Id = Guid.NewGuid(),
            PickupStatus = PickupStatus.CANCELED,
            StudentInfo = TestStudents.Bob,
            ItemRequests = new ItemRequest[]
            {
                new ItemRequest
                {
                    Item = TestItems.Bread,
                    Quantity = 2
                },
                new ItemRequest
                {
                    Item = TestItems.Spam,
                    Quantity = 17
                },
            },
            SubmittedAt = new DateTime(2021, 2, 27, 12, 0, 0)
        };

        public static readonly Pickup P10 = new Pickup
        {
            Id = Guid.NewGuid(),
            PickupStatus = PickupStatus.CANCELED,
            StudentInfo = TestStudents.Dave,
            ItemRequests = new ItemRequest[]
    {
                new ItemRequest
                {
                    Item = TestItems.Evian,
                    Quantity = 9
                },
                new ItemRequest
                {
                    Item = TestItems.Mango,
                    Quantity = 20
                },
                new ItemRequest
                {
                    Item = TestItems.LavaCake,
                    Quantity = 7
                },
                new ItemRequest
                {
                    Item = TestItems.Snapple,
                    Quantity = 4
                },
    },
            SubmittedAt = new DateTime(2021, 2, 27, 12, 0, 0)
        };

        public static readonly Pickup P11 = new Pickup
        {
            Id = Guid.NewGuid(),
            PickupStatus = PickupStatus.CANCELED,
            StudentInfo = TestStudents.Sara,
            ItemRequests = new ItemRequest[]
    {
                new ItemRequest
                {
                    Item = TestItems.Sarris,
                    Quantity = 6
                },
                new ItemRequest
                {
                    Item = TestItems.Hershey,
                    Quantity = 5
                },
                new ItemRequest
                {
                    Item = TestItems.Orange,
                    Quantity = 3
                },
    },
            SubmittedAt = new DateTime(2021, 2, 27, 12, 0, 0)
        };

        public static readonly Pickup P12 = new Pickup
        {
            Id = Guid.NewGuid(),
            PickupStatus = PickupStatus.CANCELED,
            StudentInfo = TestStudents.Mike,
            ItemRequests = new ItemRequest[]
    {
                new ItemRequest
                {
                    Item = TestItems.Mango,
                    Quantity = 9
                },
                new ItemRequest
                {
                    Item = TestItems.Icecream,
                    Quantity = 3
                },
                new ItemRequest
                {
                    Item = TestItems.Evian,
                    Quantity = 2
                },
                new ItemRequest
                {
                    Item = TestItems.Orange,
                    Quantity = 8
                },
    },
            SubmittedAt = new DateTime(2021, 2, 27, 12, 0, 0)
        };

        public static readonly Pickup P13 = new Pickup
        {
            Id = Guid.NewGuid(),
            PickupStatus = PickupStatus.CANCELED,
            StudentInfo = TestStudents.Jesse,
            ItemRequests = new ItemRequest[]
    {
                new ItemRequest
                {
                    Item = TestItems.Snapple,
                    Quantity = 2
                },
                new ItemRequest
                {
                    Item = TestItems.Sarris,
                    Quantity = 11
                },
    },
            SubmittedAt = new DateTime(2021, 2, 27, 12, 0, 0)
        };

        public static readonly Pickup P14 = new Pickup
        {
            Id = Guid.NewGuid(),
            PickupStatus = PickupStatus.CANCELED,
            StudentInfo = TestStudents.Erica,
            ItemRequests = new ItemRequest[]
    {
                new ItemRequest
                {
                    Item = TestItems.Icecream,
                    Quantity = 3
                },
                new ItemRequest
                {
                    Item = TestItems.LavaCake,
                    Quantity = 1
                },
                new ItemRequest
                {
                    Item = TestItems.Evian,
                    Quantity = 7
                },
    },
            SubmittedAt = new DateTime(2021, 2, 27, 12, 0, 0)
        };

        public static readonly Pickup P15 = new Pickup
        {
            Id = Guid.NewGuid(),
            PickupStatus = PickupStatus.CANCELED,
            StudentInfo = TestStudents.Carly,
            ItemRequests = new ItemRequest[]
    {
                new ItemRequest
                {
                    Item = TestItems.Mango,
                    Quantity = 9
                },
                new ItemRequest
                {
                    Item = TestItems.Evian,
                    Quantity = 6
                },
                new ItemRequest
                {
                    Item = TestItems.Snapple,
                    Quantity = 4
                },
    },
            SubmittedAt = new DateTime(2021, 2, 27, 12, 0, 0)
        };

        public static readonly Pickup[] Pickups = new Pickup[NUM_TEST_PICKUPS]
        {
            P0,
            P1,
            P2,
            P3,
            P4,
            P5,
            P6,
            P7,
            P8,
            P9,
            P10,
            P11,
            P12,
            P13,
            P14,    
            P15
        };
    }
}
