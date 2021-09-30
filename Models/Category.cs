using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using splat.Models;

namespace splat.Models
{
    public class Category
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int Limit { get; set; }
        public string Icon { get; set; }
        public string Description { get; set; }
        public Boolean Visible { get; set; }
        public DateTime createdAt { get; set; }
    }
}
