using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace splat.Models
{
    public class Donation
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public string? MonetaryValue { get; set; }
        public double Weight { get; set; }
        public string Donor { get; set; }
        public DateTime DonatedAt { get; set; }
    }
}
