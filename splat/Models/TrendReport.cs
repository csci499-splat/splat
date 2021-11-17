namespace splat.Models
{
    [Keyless]
    public class TrendReport
    {
        public TrendEntry[] Entries { get; set; }
    }

    [Keyless]
    public class TrendEntry
    {
        public Item Item { get; set; }
        public int[] RequestCount { get; set; }
        public double Average { get; set; }
    }
}
