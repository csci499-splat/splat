using System;
using Xunit;
using splat.Models;
using splat.Controllers;

namespace splat.Tests
{
    public class PickupControllerTest1
    {
        [Fact]
        public void UpdateStatusFromPendingToCanceled_ShouldChangeToCancel()
        {
            var testPickup = GeneratePickupWithStatus(PickupStatus.PENDING);
            PickupsController.UpdateStatus(PickupStatus.CANCELED, testPickup);

            Assert.Equal(PickupStatus.CANCELED, testPickup.PickupStatus);
        }

        //TODO: return pickup with desired status
        private Pickup GeneratePickupWithStatus(PickupStatus status)
        {
            return null;
        }

    }
}