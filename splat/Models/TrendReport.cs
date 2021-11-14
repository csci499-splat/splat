namespace splat.Models
{
    public class TrendReport
    {
        public TrendEntry[] Entries { get; set; }
    }

    public class TrendEntry
    {
        public Item Item { get; set; }
        public int[] RequestCount { get; set; }
        public double Average { get; set; }
    }
}
