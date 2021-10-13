using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace splat.Models
{
    public class CurrentHours
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [DataType(DataType.DateTime)]
        public DateTime CreatedAt { get; set; }
        [Column(TypeName = "jsonb")]
        public HourRange SundayHours { get; set; }
        [Column(TypeName = "jsonb")]
        public HourRange MondayHours { get; set; }
        [Column(TypeName = "jsonb")]
        public HourRange TuesdayHours { get; set; }
        [Column(TypeName = "jsonb")]
        public HourRange WednesdayHours { get; set; }
        [Column(TypeName = "jsonb")]
        public HourRange ThursdayHours { get; set; }
        [Column(TypeName = "jsonb")]
        public HourRange FridayHours { get; set; }
        [Column(TypeName = "jsonb")]
        public HourRange SaturdayHours { get; set; }
    }
}