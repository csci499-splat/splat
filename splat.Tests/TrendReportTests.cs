using System;
using System.Collections.Generic;
using System.Linq;
using Xunit;
using splat.Models;
using splat.Controllers;
using System.Diagnostics.CodeAnalysis;

namespace splat.Tests
{
    public class TrendReportTests
    {
        [Fact]
        public void GenerateTrendEntries_CheckIfTrendEntriesContainsCorrectNumberOfEntries()
        {
            var trendEntries = GenerateTrendEntries();
            int expectedNumberOfEntries = 3;

            Assert.Equal(expectedNumberOfEntries, trendEntries.Count());
        }

        [Fact]
        public void GenerateTrendEntries_CheckIfTrendEntriesContainsEntryForSoupTestItemWithCorrectCount()
        {
            var trendEntries = GenerateTrendEntries();
            TrendEntry soupEntry = new TrendEntry { Item = TestItems.Soup, RequestCount = 67 };

            Assert.Contains<TrendEntry>(soupEntry, trendEntries, new CheckTrendEntriesAreEqual());
        }

        [Fact]
        public void GenerateTrendEntries_CheckIfTrendEntriesContainsEntryForBeansTestItemWithCorrectCount()
        {
            var trendEntries = GenerateTrendEntries();
            TrendEntry beansEntry = new TrendEntry { Item = TestItems.Beans, RequestCount = 13 };

            Assert.Contains<TrendEntry>(beansEntry, trendEntries, new CheckTrendEntriesAreEqual());
        }

        [Fact]
        public void GenerateTrendEntries_CheckIfTrendEntriesContainsEntryForTunaTestItemWithCorrectCount()
        {
            var trendEntries = GenerateTrendEntries();
            TrendEntry tunaEntry = new TrendEntry { Item = TestItems.Tuna, RequestCount = 5 };

            Assert.Contains<TrendEntry>(tunaEntry, trendEntries, new CheckTrendEntriesAreEqual());
        }

        class CheckTrendEntriesAreEqual : IEqualityComparer<TrendEntry>
        {
            public bool Equals(TrendEntry t1, TrendEntry t2)
            {
                bool itemsAreEqual = (t1.Item.Id == t2.Item.Id);
                bool requstCountsAreEqual = (t1.RequestCount == t2.RequestCount);

                return itemsAreEqual && requstCountsAreEqual;
            }

            public int GetHashCode([DisallowNull] TrendEntry obj)
            {
                throw new NotImplementedException();
            }
        }

        private IEnumerable<TrendEntry> GenerateTrendEntries()
        {
            IQueryable<Pickup> pickups = GeneratePickups().AsQueryable();
            IEnumerable<ItemRequest[]> itemRequests = TrendReportsController.GetItemRequests(pickups);

            return TrendReportsController.GenerateTrendEntries(itemRequests.ToList());
        }

        private List<Pickup> GeneratePickups()
        {
            Guid soupId = Guid.NewGuid();
            return new List<Pickup>
            {
                new Pickup
                {
                    Id = Guid.NewGuid(),
                    StudentInfo = TestStudents.Bob,
                    ItemRequests = new ItemRequest[]
                    {
                        new ItemRequest
                        {
                            Item = TestItems.Soup,
                            Quantity = 15
                        },
                        new ItemRequest
                        {
                            Item = TestItems.Beans,
                            Quantity = 2
                        }
                    }
                },
                new Pickup
                {
                    Id = Guid.NewGuid(),
                    StudentInfo = TestStudents.Alice,
                    ItemRequests = new ItemRequest[]
                    {
                        new ItemRequest
                        {
                            Item = TestItems.Soup,
                            Quantity = 52
                        },
                        new ItemRequest
                        {
                            Item = TestItems.Tuna,
                            Quantity = 5
                        },
                        new ItemRequest
                        {
                            Item = TestItems.Beans,
                            Quantity = 11
                        }
                    }
                }
            };
        }
    }
}
