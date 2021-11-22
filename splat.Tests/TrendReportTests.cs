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
        DateRange timePeriod = new DateRange(startDate, endDate);
        IQueryable<Pickup> pickups = TestPickups.Pickups.AsQueryable();

        [Fact]
        public void GenerateTrendEntries_CheckIfTrendEntriesContainsCorrectNumberOfEntries()
        {
            TrendReport trendReport = TrendReportsController.GenerateTrendReport(pickups, timePeriod);
            int expectedNumberOfEntries = 4;

            Assert.Equal(expectedNumberOfEntries, trendReport.Entries.Count());
        }
    }
}
