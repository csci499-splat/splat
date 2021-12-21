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

        public static readonly Item Snapple = new Item
        {
            Id = Guid.NewGuid(),
            Name = "Snapple",
            CategoryId = TestCategories.Drink.Id,
            Description = "Snapple tea: peach flavor",
            Visible = true,
            CreatedAt = new DateTime(2020, 12, 1, 12, 30, 0),
            Category = TestCategories.Drink
        };

        public static readonly Item Evian = new Item
        {
            Id = Guid.NewGuid(),
            Name = "Evian",
            CategoryId = TestCategories.Drink.Id,
            Description = "21oz bottle of freshwater",
            Visible = true,
            CreatedAt = new DateTime(2020, 12, 1, 12, 30, 0),
            Category = TestCategories.Drink
        };

        public static readonly Item Sarris = new Item
        {
            Id = Guid.NewGuid(),
            Name = "Sarris",
            CategoryId = TestCategories.Candy.Id,
            Description = "Sarris Candy chocholate bar",
            Visible = true,
            CreatedAt = new DateTime(2020, 12, 1, 12, 30, 0),
            Category = TestCategories.Candy
        };

        public static readonly Item Hershey = new Item
        {
            Id = Guid.NewGuid(),
            Name = "Hershey",
            CategoryId = TestCategories.Candy.Id,
            Description = "Hershey large chocholate bar",
            Visible = true,
            CreatedAt = new DateTime(2020, 12, 1, 12, 30, 0),
            Category = TestCategories.Candy
        };

        public static readonly Item Orange = new Item
        {
            Id = Guid.NewGuid(),
            Name = "Orange",
            CategoryId = TestCategories.Fruit.Id,
            Description = "The orange is the fruit of various citrus species in the family Rutaceae;"+
            " it primarily refers to Citrus × sinensis, which is also called sweet orange,"+
            " to distinguish it from the related Citrus × aurantium, referred to as bitter orange.",
            Visible = true,
            CreatedAt = new DateTime(2020, 12, 1, 12, 30, 0),
            Category = TestCategories.Fruit
        };

        public static readonly Item Mango = new Item
        {
            Id = Guid.NewGuid(),
            Name = "Mango",
            CategoryId = TestCategories.Fruit.Id,
            Description = "A mango is an edible stone fruit produced by the tropical tree Mangifera indica"+
            " which is believed to have originated from the region between northwestern Myanmar, Bangladesh, and northeastern India.",
            Visible = true,
            CreatedAt = new DateTime(2020, 12, 1, 12, 30, 0),
            Category = TestCategories.Fruit
        };

        public static readonly Item LavaCake = new Item
        {
            Id = Guid.NewGuid(),
            Name = "LavaCake",
            CategoryId = TestCategories.Dessert.Id,
            Description = "Molten chocolate cake is a popular dessert that combines the elements of a chocolate cake and a soufflé."+
            " Its name derives from the dessert's liquid chocolate center, and it is also known as chocolate moelleux, chocolate lava cake, or simply lava cake.",
            Visible = true,
            CreatedAt = new DateTime(2020, 12, 1, 12, 30, 0),
            Category = TestCategories.Dessert
        };

        public static readonly Item Icecream = new Item
        {
            Id = Guid.NewGuid(),
            Name = "Icecream",
            CategoryId = TestCategories.Dessert.Id,
            Description = "Ice cream is a sweetened frozen food typically eaten as a snack or dessert."+
            " It may be made from milk or cream and is flavoured with a sweetener, either sugar or an alternative,"+
            " and a spice, such as cocoa or vanilla, or with fruit such as strawberries or peaches.",
            Visible = true,
            CreatedAt = new DateTime(2020, 12, 1, 12, 30, 0),
            Category = TestCategories.Dessert
        };
    }
}
