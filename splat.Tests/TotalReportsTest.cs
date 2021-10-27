using System;
using System.Linq;
using Xunit;
using splat.Models;
using splat.Controllers;
using System.Collections.Generic;

namespace splat.Tests
{
    /*
    public class TotalReportsTest
    {
        [Fact]
        public void GetTotalWeights_SumOfWeights()
        {
            var testPickups = GetTestPickups();
            var controller = new TotalReportsController(testPickups);
            var result = controller.GetTotalWeight(testPickups) as double;
        };
       private IQueryable<Pickup> GetTestPickups()
        {
            var pickupsList = new List<Pickup>();
            pickupsList.Add(new Pickup
            {
                Id = Guid.NewGuid(),
                Weight = 5.5,
                PickupStatus = PickupStatus.CANCELED,
                PickupTime = null,
                CanceledTime = new DateTime(2020, 08, 10, 6, 22, 0),
                StudentInfo = new Student
                {
                    StudentId = "1111131",
                    Age = 20,
                    OnMealPlan = true
                },
                SubmittedAt = new DateTime()

            });
            pickupsList.Add(new Pickup
            {
                Id = Guid.NewGuid(),
                Weight = 25.5,
                PickupStatus = PickupStatus.DISBURSED,
                PickupTime = new DateTime(2020, 05, 05, 6, 22, 0),
                CanceledTime = null,
                StudentInfo = new Student
                {
                    StudentId = "1111111",
                    Age = 22,
                    OnMealPlan = false
                },
                SubmittedAt = new DateTime()

            });
            pickupsList.Add(new Pickup
            {
                Id = Guid.NewGuid(),
                Weight = 50.5,
                PickupStatus = PickupStatus.DISBURSED,
                PickupTime = new DateTime(2020, 11, 05, 6, 22, 0),
                CanceledTime = null,
                StudentInfo = new Student
                {
                    StudentId = "1113111",
                    Age = 19,
                    OnMealPlan = false
                },
                SubmittedAt = new DateTime()

            });
            pickupsList.Add(new Pickup
            {
                Id = Guid.NewGuid(),
                Weight = 0.5,
                PickupStatus = PickupStatus.DISBURSED,
                PickupTime = new DateTime(2020, 11, 10, 6, 22, 0),
                CanceledTime = null,
                StudentInfo = new Student
                {
                    StudentId = "1113111",
                    Age = 19,
                    OnMealPlan = false
                },
                SubmittedAt = new DateTime()

            });
            pickupsList.Add(new Pickup
            {
                Id = Guid.NewGuid(),
                Weight = 2.5,
                PickupStatus = PickupStatus.PENDING,
                PickupTime = null,
                CanceledTime = null,
                StudentInfo = new Student
                {
                    StudentId = "1311111",
                    Age = 24,
                    OnMealPlan = false
                },
                SubmittedAt = new DateTime()

            });
            pickupsList.Add(new Pickup
            {
                Id = Guid.NewGuid(),
                Weight = 25.5,
                PickupStatus = PickupStatus.DISBURSED,
                PickupTime = new DateTime(2020, 05, 12, 6, 22, 0),
                CanceledTime = null,
                StudentInfo = new Student
                {
                    StudentId = "1111111",
                    Age = 22,
                    OnMealPlan = false
                },
                SubmittedAt = new DateTime()

            });
            return pickupsList.AsQueryable();
        }
    }*/
}
