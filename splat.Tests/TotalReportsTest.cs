using System;
using System.Linq;
using Xunit;
using splat.Models;
using splat.Controllers;
using System.Collections.Generic;

namespace splat.Tests
{
    
    public class TotalReportsTest
    {
        [Fact]
        public void GetTotalWeights_SumOfWeights()
        {
            var totalWeights = TotalReportsController.GetTotalWeight2(GeneratePickups().AsQueryable());
            var expectedTotalWeights = 48.5;
            Assert.StrictEqual(expectedTotalWeights, totalWeights);
        }

        [Fact]
        public void GetTotalDisbursements_CountPickups()
        {
            var totalDisbursements = TotalReportsController.TotalDisbursements2(GeneratePickups().AsQueryable());
            var expectedCount = 3;
            Assert.StrictEqual(expectedCount, totalDisbursements);
        }

        [Fact]
        public void GetTotalPeopleImpacted_SumStudendsWithHouseholdInfo()
        {
            var totalPeople = TotalReportsController.TotalPeopleImpacted2(GeneratePickups().AsQueryable());
            var expectedCount = 8;
            Assert.StrictEqual(expectedCount, totalPeople);
        }

        [Fact]
        public void GetTotalRecurringVisits_SumOfRepeatedIds()
        {
            var totalRecurringVisits= TotalReportsController.TotalRecurringVisits2(GeneratePickups().AsQueryable());
            var expectedCount = 1;
            Assert.StrictEqual(expectedCount, totalRecurringVisits);
        }

        [Fact]
        public void GetTotalIndividualVisits_SumOfRepeatedIds()
        {
            var totalIdividualVisits = TotalReportsController.TotalIndividualVisits2(GeneratePickups().AsQueryable());
            var expectedCount = 2;
            Assert.StrictEqual(expectedCount, totalIdividualVisits);
        }

        private List<Pickup> GeneratePickups()
        {
            return new List<Pickup>()
            {
                new Pickup
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
                    SubmittedAt = new DateTime(),
                    HouseholdInfo = new HouseholdInfo
                    {
                        NumAdults = 2,
                        NumMinors = 0,
                        NumSeniors = 0,
                    }
                },
                new Pickup
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
                    SubmittedAt = new DateTime(),
                    HouseholdInfo = new HouseholdInfo
                    {
                        NumAdults = 2,
                        NumMinors = 0,
                        NumSeniors = 0,
                    }
                },
                new Pickup
                {
                    Id = Guid.NewGuid(),
                    Weight = 20.5,
                    PickupStatus = PickupStatus.DISBURSED,
                    PickupTime = new DateTime(2020, 05, 12, 6, 22, 0),
                    CanceledTime = null,
                    StudentInfo = new Student
                    {
                        StudentId = "1111111",
                        Age = 22,
                        OnMealPlan = false
                    },
                    SubmittedAt = new DateTime(),
                    HouseholdInfo = new HouseholdInfo
                    {
                        NumAdults = 2,
                        NumMinors = 0,
                        NumSeniors = 0,
                    }
                }
            };
        }

    }
}
