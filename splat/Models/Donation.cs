using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace splat.Models
{
    [Index(nameof(Donor))]
    public class Donation
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public double? MonetaryValue { get; set; }
        public double? Weight { get; set; }
        [Required]
        public string Donor { get; set; }
        [DataType(DataType.DateTime)]
        [Column(TypeName = "timestamptz")]
        public DateTime DonatedAt { get; set; }
    }
}
