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
        public string name { get; set; }
        public string description { get; set; }
        public Boolean visible { get; set; }
        public int maxItemRequest { get; set; }
        public string createdAt { get; set; }
    }
}
