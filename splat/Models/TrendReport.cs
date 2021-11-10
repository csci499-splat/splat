using System.Collections.Generic;

namespace splat.Models
{
    public class TrendReport
    {
        public List<TrendEntry> Entries { get; set; }
    }

    public class TrendEntry
    {
        Category category;
        List<TrendItemEntry> ItemEntries;
    }

    public class TrendItemEntry
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
