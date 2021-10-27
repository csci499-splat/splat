using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace splat.Models
{
    public class TrendReport
    {
        public TrendEntry[] entries { get; set; }
    }

    public class TrendEntry
    {
        public Item Item { get; set; }
        public int RequestCount { get; set; }
    }
}
