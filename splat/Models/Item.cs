using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace splat.Models
{
    [Index(nameof(Name), nameof(Description))]
    public class Item
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public Guid CategoryId { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]

        public bool? Visible { get; set; }

        [DataType(DataType.Date)]
        public DateTime CreatedAt { get; set; }

        public Category Category { get; set; }
    }

    public class ItemDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Category Category { get; set; }
        public string Description { get; set; }
        public bool Visible { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
