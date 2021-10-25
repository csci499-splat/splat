using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace splat.Models
{
    public class Discard
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        [Required]
        public double Weight { get; set; }
        [DataType(DataType.DateTime)]
        [Required]
        [Column(TypeName = "timestamptz")]
        public DateTime DiscardedAt { get; set; }
    }
}
