using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

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
}
