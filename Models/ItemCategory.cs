using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SPLAT.Models
{
    public class ItemCategory
    {
        private string categoryName;

        public string CategoryName { get => categoryName; set => categoryName = value; }
        public ItemCategory(string categoryName = "") => this.categoryName = categoryName;

        public ItemCategory() { }
    }
}
