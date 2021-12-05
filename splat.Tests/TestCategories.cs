using splat.Models;
using System;

namespace splat.Tests
{
    public static class TestCategories
    {
        public static readonly Category CannedVegetables = new Category
        {
            Id = Guid.NewGuid(),
            Name = "Canned Vegetables",
            Limit = 100,
            Description = "Veggies in a can!",
            Visible = true
        };

        public static readonly Category CannedMeat = new Category
        {
            Id = Guid.NewGuid(),
            Name = "Canned Meat",
            Limit = 100,
            Description = "Meat in a can!",
            Visible = true
        };

        public static readonly Category CannedSoup = new Category
        {
            Id = Guid.NewGuid(),
            Name = "Canned Soup",
            Limit = 100,
            Description = "Soup in a can!",
            Visible = true
        };

        public static readonly Category BreadStuffs = new Category
        {
            Id = Guid.NewGuid(),
            Name = "Bread Stuffs",
            Limit = 100,
            Description = "Stuff that's like bread!",
            Visible = true
        };
    }
}
