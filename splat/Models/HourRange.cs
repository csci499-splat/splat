using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace splat.Models
{
    public class HourRange
    {
        [Required]
        [DataType(DataType.DateTime)]
        public DateTime TimeStart { get; set; }
        [Required]
        [DataType(DataType.DateTime)]
        public DateTime TimeEnd { get; set; }
    }
}