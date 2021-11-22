using splat.Models;
using System;

namespace splat.Tests
{
    public static class TestPickups
    {
        public const int NUM_TEST_PICKUPS = 10;

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
            PickupTime = new DateTime(2021, 1, 13, 12, 0, 0)
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
            PickupTime = new DateTime(2021, 1, 14, 12, 0, 0)
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
            PickupTime = new DateTime(2021, 1, 16, 12, 0, 0)
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
            PickupTime = new DateTime(2021, 1, 19, 12, 0, 0)
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
            PickupTime = new DateTime(2021, 2, 6, 12, 0, 0)
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
            PickupTime = new DateTime(2021, 2, 10, 12, 0, 0)
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
            PickupTime = new DateTime(2021, 2, 15, 12, 0, 0)
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
            PickupTime = new DateTime(2021, 2, 20, 12, 0, 0)
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
            PickupTime = new DateTime(2021, 2, 27, 12, 0, 0)
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
            PickupTime = new DateTime(2021, 2, 27, 12, 0, 0)
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
            P9
        };
    }
}
