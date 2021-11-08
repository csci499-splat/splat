using System.Collections.Generic;

namespace splat.Models
{
    public class TrendReport
    {
        public const int WEEK = 7;
        public TrendEntry[] Entries { get; set; }
    }

    public class TrendEntry
    {
        public Item Item { get; set; }
        public List<RequestHistogramBin> RequestBins { get; set; }
        public double Average { get; set; }
    }

    public class RequestHistogramBin
    {
        int RequestCount;
        DateRange BinTime;
    }
}
