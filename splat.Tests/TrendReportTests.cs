using System;
using System.Linq;
using Xunit;
using splat.Models;
using splat.Controllers;
using Moq;

namespace splat.Tests
{
    public class TrendReportTests
    {
        static DateTime startDate = new DateTime(2021, 01, 1, 0, 0, 0);
        static DateTime endDate = new DateTime(2021, 03, 1, 0, 0, 0);
        static DateRange timePeriod = new DateRange(startDate, endDate);
        public Mock<IQueryable<Pickup>> mockPickups = new Mock<IQueryable<Pickup>>();
    }
}
