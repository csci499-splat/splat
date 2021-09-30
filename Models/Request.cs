using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace splat.Models
{
    public class Request
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public ApplicationUser User{ get; set; }
        public DateTime submittedAt { get; set; }
        public HouseholdInfo? HouseholdInfo { get; set; }
        public ItemRequest[] itemRequests { get; set; }
        public DateTime RequestedPickupTime { get; set; }
        public string OtherNotes { get; set; }
    }
}
