using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SPLAT.Models
{
    public class Item
    {
        private string itemName;
        private string itemCategory;
        private bool isStudentInput;

        public string ItemName { get => itemName; set => itemName = value; }
        public string ItemCategory { get => itemCategory; set => itemCategory = value; }
        public bool IsStudentInput { get => isStudentInput; set => isStudentInput = value; }

        public Item(string itemName = "", string itemCategory = "", bool isStudentInput = false)
        {
            this.itemName = itemName;
            this.itemCategory = itemCategory;
            this.isStudentInput = isStudentInput;
        }
    }
}
