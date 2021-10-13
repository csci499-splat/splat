using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace splat.Models
{
    public class DayClosed
    {
        [Key]
        [DataType(DataType.Date)]
        public DateTime ClosedOn { get; set; }
    }
}