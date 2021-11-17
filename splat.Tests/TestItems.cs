using splat.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace splat.Tests
{
    public class TestItems
    {
        public static readonly Item Soup = new Item
        {
            Id = Guid.NewGuid(),
            Name = "Soup",
            CategoryId = Guid.NewGuid(),
            Description = "It's soup!",
            Visible = true,
            CreatedAt = new DateTime(2020, 12, 1, 12, 30, 0)
        };

        public static readonly Item Beans = new Item
        {
            Id = Guid.NewGuid(),
            Name = "Beans",
            CategoryId = Guid.NewGuid(),
            Description = "It's beans!",
            Visible = true,
            CreatedAt = new DateTime(2020, 12, 1, 12, 30, 0)
        };

        public static readonly Item Bread = new Item
        {
            Id = Guid.NewGuid(),
            Name = "Bread",
            CategoryId = Guid.NewGuid(),
            Description = "It's bread!",
            Visible = true,
            CreatedAt = new DateTime(2020, 12, 1, 12, 30, 0)
        };

        public static readonly Item Tuna = new Item
        {
            Id = Guid.NewGuid(),
            Name = "Tuna",
            CategoryId = Guid.NewGuid(),
            Description = "You can tune a piano but you can't tune a fish!",
            Visible = true,
            CreatedAt = new DateTime(2020, 12, 1, 12, 30, 0)
        };
    }
}
