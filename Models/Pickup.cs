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
        public Request Request { get; set; }
        public double? Weight { get; set; }
        PickupStatus PickupStatus { get; set; }
        public DateTime? pickupTime { get; set; }
        public DateTime? canceledTime { get; set; }
    }
    enum PickupStatus
    {
        PENDING,
        WAITING,
        DISBURSED,
        CANCELED
    }
}
