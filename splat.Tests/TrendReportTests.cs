using System;
using System.Linq;
using Xunit;
using splat.Models;
using splat.Controllers;
using Moq;
using static splat.Controllers.TrendReportsController;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace splat.Tests
{
    public class TrendReportTests
    {
        // CATEGORY named constants
        const int VEGGIES = 0;
        const int CANNED_MEATS = 1;
        const int BREAD_STUFFS = 2;
        const int CANNED_SOUP = 3;
        // ITEM named constants for VEGGIES
        const int BEANS = 0;
        const int CARROTS = 1;
        // ITEM named constants for CANNED_MEATS
        const int SPAM = 0;
        const int TUNA = 1;
        // ITEM named constants for BREAD_STUFFS
        const int BREAD = 0;
        // ITEM named constants for CANNED_SOUP      
        const int SOUP = 0;

        readonly Week WEEK1 = new Week(new DateTime(2021, 01, 1, 0, 0, 0), new DateTime(2021, 01, 7, 0, 0, 0));
        readonly Week WEEK2 = new Week(new DateTime(2021, 01, 8, 0, 0, 0), new DateTime(2021, 01, 14, 0, 0, 0));
        readonly Week WEEK3 = new Week(new DateTime(2021, 01, 15, 0, 0, 0), new DateTime(2021, 01, 21, 0, 0, 0));
        readonly Week WEEK4 = new Week(new DateTime(2021, 01, 22, 0, 0, 0), new DateTime(2021, 01, 28, 0, 0, 0));
        readonly Week WEEK5 = new Week(new DateTime(2021, 01, 29, 0, 0, 0), new DateTime(2021, 02, 4, 0, 0, 0));
        readonly Week WEEK6 = new Week(new DateTime(2021, 02, 5, 0, 0, 0), new DateTime(2021, 02, 11, 0, 0, 0));
        readonly Week WEEK7 = new Week(new DateTime(2021, 02, 12, 0, 0, 0), new DateTime(2021, 02, 18, 0, 0, 0));
        readonly Week WEEK8 = new Week(new DateTime(2021, 02, 19, 0, 0, 0), new DateTime(2021, 02, 25, 0, 0, 0));
        readonly Week WEEK9 = new Week(new DateTime(2021, 02, 26, 0, 0, 0), new DateTime(2021, 03, 1, 0, 0, 0));

        static DateTime startDate = new DateTime(2021, 01, 1, 0, 0, 0);
        static DateTime endDate = new DateTime(2021, 03, 1, 0, 0, 0);
        static DateRange timePeriod = new DateRange(startDate, endDate);
        static IQueryable<Pickup> pickups = TestPickups.Pickups.AsQueryable();

        [Fact]
        public void TestGetTrendReport_CheckNumberOfCategories()
        {
            TrendReport report = TrendReportsController.GetTrendReport(pickups, timePeriod);
            int expectedNumberOfCategories = 4;
            Assert.Equal(expectedNumberOfCategories, report.Entries.Count);
        }

        [Fact]
        public void TestGetTrendReport_CheckNumberOfWeeks()
        {
            TrendReport report = TrendReportsController.GetTrendReport(pickups, timePeriod);
            int expectedNumberOfCategories = 9;
            Assert.Equal(expectedNumberOfCategories, report.Entries[VEGGIES].ItemEntries[CARROTS].RequestBins.Count);
        }

        [Fact]
        public void TestGetTrendReport_CheckTimePeriod()
        {
            TrendReport report = TrendReportsController.GetTrendReport(pickups, timePeriod);
            Assert.Equal(timePeriod, report.Entries[VEGGIES].TimePeriod);
        }

        [Fact]
        public void TestGetTrendReport_CheckWeek1()
        {
            TrendReport report = TrendReportsController.GetTrendReport(pickups, timePeriod);
            Assert.Equal(WEEK1, report.Entries[VEGGIES].ItemEntries[CARROTS].RequestBins[0].Week, new WeekComparitor());
        }

        [Fact]
        public void TestGetTrendReport_CheckWeek2()
        {
            TrendReport report = TrendReportsController.GetTrendReport(pickups, timePeriod);
            Assert.Equal(WEEK2, report.Entries[VEGGIES].ItemEntries[CARROTS].RequestBins[1].Week, new WeekComparitor());
        }

        [Fact]
        public void TestGetTrendReport_CheckWeek3()
        {
            TrendReport report = TrendReportsController.GetTrendReport(pickups, timePeriod);
            Assert.Equal(WEEK3, report.Entries[VEGGIES].ItemEntries[CARROTS].RequestBins[2].Week, new WeekComparitor());
        }

        [Fact]
        public void TestGetTrendReport_CheckWeek4()
        {
            TrendReport report = TrendReportsController.GetTrendReport(pickups, timePeriod);
            Assert.Equal(WEEK4, report.Entries[VEGGIES].ItemEntries[CARROTS].RequestBins[3].Week, new WeekComparitor());
        }

        [Fact]
        public void TestGetTrendReport_CheckWeek5()
        {
            TrendReport report = TrendReportsController.GetTrendReport(pickups, timePeriod);
            Assert.Equal(WEEK5, report.Entries[VEGGIES].ItemEntries[CARROTS].RequestBins[4].Week, new WeekComparitor());
        }

        [Fact]
        public void TestGetTrendReport_CheckWeek6()
        {
            TrendReport report = TrendReportsController.GetTrendReport(pickups, timePeriod);
            Assert.Equal(WEEK6, report.Entries[VEGGIES].ItemEntries[CARROTS].RequestBins[5].Week, new WeekComparitor());
        }

        [Fact]
        public void TestGetTrendReport_CheckWeek7()
        {
            TrendReport report = TrendReportsController.GetTrendReport(pickups, timePeriod);
            Assert.Equal(WEEK7, report.Entries[VEGGIES].ItemEntries[CARROTS].RequestBins[6].Week, new WeekComparitor());
        }

        [Fact]
        public void TestGetTrendReport_CheckWeek8()
        {
            TrendReport report = TrendReportsController.GetTrendReport(pickups, timePeriod);
            Assert.Equal(WEEK8, report.Entries[VEGGIES].ItemEntries[CARROTS].RequestBins[7].Week, new WeekComparitor());
        }

        [Fact]
        public void TestGetTrendReport_CheckWeek9()
        {
            TrendReport report = TrendReportsController.GetTrendReport(pickups, timePeriod);
            Assert.Equal(WEEK9, report.Entries[VEGGIES].ItemEntries[CARROTS].RequestBins[8].Week, new WeekComparitor());
        }

        [Fact]
        public void TestGetTrendReport_CheckAveragesPerWeekForBeans()
        {
            TrendReport report = TrendReportsController.GetTrendReport(pickups, timePeriod);
            double expectedAverage = 5.333333333333333;
            Assert.Equal(expectedAverage, report.Entries[VEGGIES].ItemEntries[CARROTS].Average);
        }

        [Fact]
        public void TestGetTrendReport_CheckAveragesPerWeekForCarrots()
        {
            TrendReport report = TrendReportsController.GetTrendReport(pickups, timePeriod);
            double expectedAverage = 7.555555555555555;
            Assert.Equal(expectedAverage, report.Entries[VEGGIES].ItemEntries[BEANS].Average);
        }

        [Fact]
        public void TestGetTrendReport_CheckAveragesPerWeekForSoup()
        {
            TrendReport report = TrendReportsController.GetTrendReport(pickups, timePeriod);
            double expectedAverage = 0.7777777777777778;
            Assert.Equal(expectedAverage, report.Entries[CANNED_SOUP].ItemEntries[SOUP].Average);
        }

        [Fact]
        public void TestGetTrendReport_CheckAveragesPerWeekForBread()
        {
            TrendReport report = TrendReportsController.GetTrendReport(pickups, timePeriod);
            double expectedAverage = 1.8888888888888888;
            Assert.Equal(expectedAverage, report.Entries[BREAD_STUFFS].ItemEntries[BREAD].Average);
        }

        [Fact]
        public void TestGetTrendReport_CheckAveragesPerWeekForTuna()
        {
            TrendReport report = TrendReportsController.GetTrendReport(pickups, timePeriod);
            double expectedAverage = 0.5555555555555556;
            Assert.Equal(expectedAverage, report.Entries[CANNED_MEATS].ItemEntries[TUNA].Average);
        }

        [Fact]
        public void TestGetTrendReport_CheckAveragesPerWeekForSpam()
        {
            TrendReport report = TrendReportsController.GetTrendReport(pickups, timePeriod);
            double expectedAverage = 11.666666666666666;
            Assert.Equal(expectedAverage, report.Entries[CANNED_MEATS].ItemEntries[SPAM].Average);
        }

        public class WeekComparitor : IEqualityComparer<Week>
        {
            public bool Equals(Week x, Week y)
            {
                return x.DateFrom.Equals(y.DateFrom) && (x.DateTo.Equals(y.DateTo));
            }

            public int GetHashCode([DisallowNull] Week obj)
            {
                throw new NotImplementedException();
            }
        }
    }
}
