using System.Collections.Generic;

namespace splat.Models
{
    public class TrendReport
    {
        public List<TrendEntry> Entries { get; set; }
    }

    public class TrendEntry
    {
        public Category Category { get; set; }
        public List<TrendItemEntry> ItemEntries { get; set; }
        public DateRange TimePeriod { get; set; }
    }

    public class TrendItemEntry
    {
        public Item Item { get; set; }
        public List<RequestHistogramBin> RequestBins { get; set; }
        public double Average { get; set; }
    }

    public class RequestHistogramBin
    {
        public int RequestedItemCount { get; set; }
        [JsonProperty("BinTime")]
        public Week Week { get; set; }
    }
}
