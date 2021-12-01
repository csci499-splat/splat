using CsvHelper.Configuration;
using splat.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace splat.Util.CSVFileUploads
{
    public class ItemMap : ClassMap<Item>
    {
        public ItemMap()
        {
            Map(m => m.Id).Name("Item ID");
            Map(m => m.CategoryId).Name("Category ID");
            Map(m => m.Name).Name("Name");
            Map(m => m.Description).Name("Description");
            Map(m => m.Visible).Name("Visible?");
            Map(m => m.CreatedAt).Name("Created At");
        }
    }
}
