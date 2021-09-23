using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace splat.Models
{
    public class Pickup
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public Request request { get; set; }
        public double weight { get; set; }
        PickupStatus pickupStatus { get; set; }
        public string pickupTime { get; set; }
        public string? canceledTime { get; set; }
    }
    enum PickupStatus
    {
        PENDING,
        WAITING,
        DISBURSED,
        CANCELED
    }
}
