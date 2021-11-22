using splat.Models;
using System;

namespace splat.Tests
{
    public static class TestItems
    {
        public const int NUM_TEST_ITEMS = 6;

        public static readonly Item Soup = new Item
        {
            Id = Guid.NewGuid(),
            Name = "Soup",
            CategoryId = TestCategories.CannedSoup.Id,
            Description = "It's soup!",
            Visible = true,
            CreatedAt = new DateTime(2020, 12, 1, 12, 30, 0),
            Category = TestCategories.CannedSoup
        };

        public static readonly Item Beans = new Item
        {
            Id = Guid.NewGuid(),
            Name = "Beans",
            CategoryId = TestCategories.CannedVegetables.Id,
            Description = "It's beans!",
            Visible = true,
            CreatedAt = new DateTime(2020, 12, 1, 12, 30, 0),
            Category = TestCategories.CannedVegetables
        };

        public static readonly Item Bread = new Item
        {
            Id = Guid.NewGuid(),
            Name = "Bread",
            CategoryId = TestCategories.BreadStuffs.Id,
            Description = "It's bread!",
            Visible = true,
            CreatedAt = new DateTime(2020, 12, 1, 12, 30, 0),
            Category = TestCategories.BreadStuffs
        };

        public static readonly Item Tuna = new Item
        {
            Id = Guid.NewGuid(),
            Name = "Tuna",
            CategoryId = TestCategories.CannedMeat.Id,
            Description = "You can tune a piano but you can't tune a fish!",
            Visible = true,
            CreatedAt = new DateTime(2020, 12, 1, 12, 30, 0),
            Category = TestCategories.CannedMeat
        };

        public static readonly Item Carrots = new Item
        {
            Id = Guid.NewGuid(),
            Name = "Carrots",
            CategoryId = TestCategories.CannedVegetables.Id,
            Description = "It's a can of carrots!",
            Visible = true,
            CreatedAt = new DateTime(2020, 12, 1, 12, 30, 0),
            Category = TestCategories.CannedVegetables
        };

        public static readonly Item Spam = new Item
        {
            Id = Guid.NewGuid(),
            Name = "SPAM",
            CategoryId = TestCategories.CannedMeat.Id,
            Description = "SMAP and SPAM and SPAM!",
            Visible = true,
            CreatedAt = new DateTime(2020, 12, 1, 12, 30, 0),
            Category = TestCategories.CannedMeat
        };
    }
}
