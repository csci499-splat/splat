using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations;

namespace splat.Models
{
    [Keyless]
    public class DateRange
    {
        public DateRange(DateTime dateFrom, DateTime dateTo)
        {
            DateFrom = dateFrom;
            DateTo = dateTo;
        }
        public DateRange(DateRange timePeriod)
        {
            DateFrom = timePeriod.DateFrom;
            DateTo = timePeriod.DateTo;
        }

        [Required]
        [DataType(DataType.Date)]
        public DateTime DateFrom { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime DateTo { get; set; }

        public TimeSpan GetDuratrion()
        {
            TimeSpan span = DateFrom - DateTo;
            return span.Duration();
        }
    }

    public class WeeksInfo
    {
        private const int NUM_FULL_WEEKS = 0;
        private const int REMAINDER = 1;
        private const int SIZE = 2;

        private int[] Info;

        public WeeksInfo(DateRange timePeriod)
        {
            Info = new int[SIZE];
            ExtractInfo(timePeriod);
        }

        void ExtractInfo(DateRange timePeriod)
        {
            int daysPerWeek = (Week.WEEK.Days + 1);
            int numDays = timePeriod.GetDuratrion().Days;
            Info[NUM_FULL_WEEKS] = numDays / daysPerWeek;
            Info[REMAINDER] = numDays % daysPerWeek;
        }

        public int GetNumFullweeks() { return Info[NUM_FULL_WEEKS]; }
        public int GetRemainingNumDays() { return Info[REMAINDER]; }
    }

    public class Week : DateRange
    {
        // A week is six days here to account for +/- 1 at the end of each week.
        public static readonly TimeSpan WEEK = new TimeSpan(6, 0, 0, 0);
        public Week(DateTime dateFrom, DateTime dateTo) : base(dateFrom, dateTo)
        {
            if (BiggerThanWeek(dateTo - dateFrom))
                throw new Exception("DateRange greater than a week!");
            else
            {
                DateFrom = dateFrom;
                DateTo = dateTo;
            }
        }

        bool BiggerThanWeek(TimeSpan diff)
        {
            return diff.CompareTo(WEEK) > 0;
        }
    }
}
