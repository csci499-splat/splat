using System;
using System.Collections.Generic;
using System.Linq;
using Xunit;
using splat.Models;
using splat.Controllers;
using System.Diagnostics.CodeAnalysis;

namespace splat.Tests
{
    public class TrendReportTests
    {
        static DateTime startDate = new DateTime(2021, 01, 1, 0, 0, 0);
        static DateTime endDate = new DateTime(2021, 03, 1, 0, 0, 0);
        static DateRange timePeriod = new DateRange(startDate, endDate);
        static IQueryable<Pickup> pickups = TestPickups.Pickups.AsQueryable();
        TrendReport trendReport = TrendReportsController.GenerateTrendReport(pickups, timePeriod);

        [Fact]
        public void GenerateTrendEntries_CheckIfTrendEntriesContainsCorrectNumberOfEntries()
        {
            int expectedNumberOfEntries = 4;
            Assert.Equal(expectedNumberOfEntries, trendReport.Entries.Count());
        }

        [Fact]
        public void GenerateTrendEntries_CheckSpecificTrendItemEntryForCorrectAverage()
        {
            double expectedWeeklyAverageForBeans = 68.0/9;
            Assert.Equal(expectedWeeklyAverageForBeans, trendReport.Entries[0].ItemEntries[0].Average);
        }
    }
}
