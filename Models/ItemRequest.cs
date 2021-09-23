using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace splat.Models
{
    public class ItemRequest
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Item item { get; set; }
        public int quantity { get; set; }
    }
}
