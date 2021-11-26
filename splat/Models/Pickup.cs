using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace splat.Models
{
    [Index(nameof(PickupStatus), nameof(StudentInfo))]
    public class Pickup
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        [DataType(DataType.EmailAddress)]
        public string ApplicationUserEmail { get; set; }
        public double? Weight { get; set; }
        [Required]
        public PickupStatus PickupStatus { get; set; }
        [DataType(DataType.DateTime)]
        [Column(TypeName = "timestamptz")]
        public DateTime? PickupTime { get; set; }
        [DataType(DataType.DateTime)]
        [Column(TypeName = "timestamptz")]
        public DateTime? CanceledTime { get; set; }
        [Required]
        [Column(TypeName = "jsonb")]
        public Student StudentInfo { get; set; }
        [DataType(DataType.DateTime)]
        [Column(TypeName = "timestamptz")]
        public DateTime SubmittedAt { get; set; }
        [Column(TypeName = "jsonb")]
        public HouseholdInfo HouseholdInfo { get; set; }
        [Required]
        [Column(TypeName = "jsonb")]
        public ItemRequest[] ItemRequests { get; set; }
        [DataType(DataType.DateTime)]
        [Column(TypeName = "timestamptz")]
        public DateTime RequestedPickupTime { get; set; }
        public string OtherNotes { get; set; }
    }
    public enum PickupStatus
    {
        PENDING,
        WAITING,
        DISBURSED,
        CANCELED
    }
}
