using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations;

namespace splat.Models
{
    [Keyless]
    public class DateRange
    {
        [Required]
        [DataType(DataType.Date)]
        public DateTime DateFrom { get; set; }
        [Required]
        [DataType(DataType.Date)]
        public DateTime DateTo { get; set; }
    }

    public class WeekInfo
    {
        private const int NUM_WEEKS = 0;
        private const int REMAINDER = 1;
        private const int SIZE = 2;

        private int[] Info;

        public WeekInfo(int numWeeks, int daysRemaining)
        {
            Info = new int[SIZE];
            Info[NUM_WEEKS] = numWeeks;
            Info[REMAINDER] = daysRemaining;
        }

        public int GetNumWeeks() { return Info[NUM_WEEKS]; }
        public int GetNDaysRemaing() { return Info[REMAINDER]; }
    }

    public class Week : DateRange
    {
        readonly TimeSpan WEEK = new TimeSpan(7, 0, 0, 0);
        public Week(DateRange range) : base() 
        {
            TimeSpan diff = range.DateTo - range.DateFrom;
            int compareResult = diff.CompareTo(WEEK);
            if (compareResult > 0)
                throw new Exception("DateRange greater than a week!");
            else
            {
                DateFrom = range.DateFrom;
                DateTo = range.DateTo;
            }
        }
    }
}
