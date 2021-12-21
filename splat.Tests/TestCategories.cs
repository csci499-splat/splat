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

        public static readonly Category Drink = new Category
        {
            Id = Guid.NewGuid(),
            Name = "Drink",
            Limit = 10,
            Description = "A container containing consumable liquid 128oz and below",
            Visible = true
        };

        public static readonly Category Candy = new Category
        {
            Id = Guid.NewGuid(),
            Name = "Bread Stuffs",
            Limit = 15,
            Description = "a sweet food made with sugar or other sweeteners, typically formed in small, shaped pieces and flavored with chocolate, fruit, or nuts",
            Visible = true
        };

        public static readonly Category Fruit = new Category
        {
            Id = Guid.NewGuid(),
            Name = "Fruit",
            Limit = 20,
            Description = "the sweet and fleshy product of a tree or other plant that contains seed and can be eaten as food.",
            Visible = true
        };

        public static readonly Category Dessert = new Category
        {
            Id = Guid.NewGuid(),
            Name = "Dessert",
            Limit = 5,
            Description = "the sweet course eaten at the end of a meal",
            Visible = true
        };
    }
}
