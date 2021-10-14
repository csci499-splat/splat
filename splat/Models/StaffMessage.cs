using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace splat.Models
{
    public class StaffMessage
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [DataType(DataType.DateTime)]
        [Column(TypeName = "timestamptz")]
        public DateTime CreatedAt { get; set; }
        public string Message { get; set; }
    }
}