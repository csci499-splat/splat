using Newtonsoft.Json;
using System.Collections.Generic;

namespace splat.Models
{
    public class TrendReport
    {
        [JsonProperty("entries")]
        public List<TrendEntry> Entries { get; set; }
    }

    public class TrendEntry
    {
        [JsonProperty("category")]
        public Category Category { get; set; }
        [JsonProperty("trendItemEntries")]
        public List<TrendItemEntry> ItemEntries { get; set; }
        public DateRange TimePeriod { get; set; }
    }

    public class TrendItemEntry
    {
        [JsonProperty("item")]
        public Item Item { get; set; }
        [JsonProperty("requestBin")]
        public List<RequestHistogramBin> RequestBins { get; set; }
        [JsonProperty("average")]
        public double Average { get; set; }
    }

    public class RequestHistogramBin
    {
        [JsonProperty("requestCount")]
        public int RequestedItemCount { get; set; }
        [JsonProperty("binTime")]
        public Week Week { get; set; }
    }
}
