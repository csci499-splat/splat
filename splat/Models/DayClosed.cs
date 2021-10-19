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
        [Column(TypeName = "timestamptz")]
        public DateTime ClosedOn { get; set; }
    }
}