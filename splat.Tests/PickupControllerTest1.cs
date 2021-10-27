using System;
using Xunit;
using splat.Models;
using splat.Controllers;

namespace splat.Tests
{
    public class PickupControllerTest1
    {

    [Fact]
        public void UpdateStatusFromPendingToWaiting_ShouldChangeToWaiting()
        {
            var testPickup = GeneratePickupWithStatus(PickupStatus.PENDING);
            PickupsController.UpdateStatus(PickupStatus.WAITING, testPickup);

            Assert.Equal(PickupStatus.WAITING, testPickup.PickupStatus);
        }

        [Fact]
        public void UpdateStatusFromPendingToCanceled_ShouldChangeToCancel()
        {
            var testPickup2 = GeneratePickupWithStatus(PickupStatus.PENDING);
            PickupsController.UpdateStatus(PickupStatus.CANCELED, testPickup2);

            Assert.Equal(PickupStatus.CANCELED, testPickup2.PickupStatus);     
        }

        [Fact]
        public void UpdateStatusFromWaitingToDisbursed_ShouldChangeToDisbursed()
        {
            var testPickup3 = GeneratePickupWithStatus(PickupStatus.WAITING);
            PickupsController.UpdateStatus(PickupStatus.DISBURSED, testPickup3);

            Assert.Equal(PickupStatus.DISBURSED, testPickup3.PickupStatus);      
        }

        [Fact]
        public void UpdateStatusFromPendingToWaiting_ShouldChangeToCancel()
        {
            var testPickup4 = GeneratePickupWithStatus(PickupStatus.WAITING);
            PickupsController.UpdateStatus(PickupStatus.CANCELED, testPickup4);

            Assert.Equal(PickupStatus.CANCELED, testPickup4.PickupStatus);
        }



        private Pickup GeneratePickupWithStatus(PickupStatus status)
        {
            return new Pickup
            {
                Id = Guid.NewGuid(),
                ApplicationUserEmail = "John@gmail.com",
                Weight = 43,
                PickupStatus = status,
                PickupTime = new DateTime(2021, 10, 26, 08, 23, 22),
                CanceledTime = null,
                StudentInfo = new Student(),
                SubmittedAt = new DateTime(),
                HouseholdInfo = new HouseholdInfo { NumSeniors = 2, NumAdults = 2, NumMinors = 3 },
                ItemRequests = new ItemRequest[1],
                RequestedPickupTime = new DateTime(2021, 10, 26, 04, 10, 00),
                OtherNotes = "Today is a day"
            };
        }


    }
}