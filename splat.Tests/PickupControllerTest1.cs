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
            var result = PickupsController.TestUpdateStatus(PickupStatus.PENDING, PickupStatus.WAITING);

            Assert.True(result);
        }

        [Fact]
        public void UpdateStatusFromPendingToCanceled_ShouldChangeToCancel()
        {
            var result = PickupsController.TestUpdateStatus(PickupStatus.PENDING, PickupStatus.CANCELED);

            Assert.True(result);
        }

        [Fact]
        public void UpdateStatusFromWaitingToDisbursed_ShouldChangeToDisbursed()
        {
            var result = PickupsController.TestUpdateStatus(PickupStatus.WAITING, PickupStatus.DISBURSED);

            Assert.True(result);
        }

        [Fact]
        public void UpdateStatusFromPendingToWaiting_ShouldChangeToCancel()
        {
            var result = PickupsController.TestUpdateStatus(PickupStatus.WAITING, PickupStatus.CANCELED);

            Assert.True(result);
        }

        [Fact]
        public void UpdateStatusFromPendingToDispursed_ShouldThrowExceptionError()
        {
            Assert.ThrowsAny<Exception>(() => PickupsController.TestUpdateStatus(PickupStatus.PENDING, PickupStatus.DISBURSED));
        }

        [Fact]
        public void UpdateStatusFromCanceledToWaiting_ShouldThrowExceptionError()
        {
            Assert.ThrowsAny<Exception>(() => PickupsController.TestUpdateStatus(PickupStatus.CANCELED, PickupStatus.WAITING));
        }

        [Fact]
        public void UpdateStatusFromCanceledToCanceled_ShouldThrowExceptionError()
        {
            Assert.ThrowsAny<Exception>(() => PickupsController.TestUpdateStatus(PickupStatus.CANCELED, PickupStatus.CANCELED));
        }


        [Fact]
        public void UpdateStatusFromDisbursedToCanceled_ShouldThrowExceptionError()
        {
            Assert.ThrowsAny<Exception>(() => PickupsController.TestUpdateStatus(PickupStatus.DISBURSED, PickupStatus.CANCELED));
        }

        [Fact]
        public void UpdateStatusFromPendingToPending_ShouldThrowExceptionError()
        {
            Assert.ThrowsAny<Exception>(() => PickupsController.TestUpdateStatus(PickupStatus.PENDING, PickupStatus.PENDING));
        }

        [Fact]
        public void UpdateStatusFromWaitingToWaiting_ShouldThrowExceptionError()
        {
            Assert.ThrowsAny<Exception>(() => PickupsController.TestUpdateStatus(PickupStatus.WAITING, PickupStatus.WAITING));
        }

        [Fact]
        public void UpdateStatusFromWaitingToPending_ShouldThrowExceptionError()
        {
            Assert.ThrowsAny<Exception>(() => PickupsController.TestUpdateStatus(PickupStatus.WAITING, PickupStatus.PENDING));
        }

        public void UpdateStatusFromCanceledToPending_ShouldThrowExceptionError()
        {
            Assert.ThrowsAny<Exception>(() => PickupsController.TestUpdateStatus(PickupStatus.CANCELED, PickupStatus.PENDING));
        }

        [Fact]
        public void UpdateStatusFromCanceledToDisbursed_ShouldThrowExceptionError()
        {
            Assert.ThrowsAny<Exception>(() => PickupsController.TestUpdateStatus(PickupStatus.CANCELED, PickupStatus.DISBURSED));
        }

        [Fact]
        public void UpdateStatusFromDisbursedToWaiting_ShouldThrowExceptionError()
        {
            Assert.ThrowsAny<Exception>(() => PickupsController.TestUpdateStatus(PickupStatus.DISBURSED, PickupStatus.WAITING));
        }

        [Fact]
        public void UpdateStatusFromDisbursedToPending_ShouldThrowExceptionError()
        {
            Assert.ThrowsAny<Exception>(() => PickupsController.TestUpdateStatus(PickupStatus.DISBURSED, PickupStatus.PENDING));
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