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
        public Student student { get; set; }
        public string submittedAt { get; set; }
        public HouseholdInfo householdInfo { get; set; }
        public ItemRequest[] itemRequests { get; set; }
        public string requestedPickupTime { get; set; }
        public string ontherNotes { get; set; }
    }
}
