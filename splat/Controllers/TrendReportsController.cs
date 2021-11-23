using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using splat.Models;

namespace splat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    //[Authorize(Policy = "ElevatedRights")]
    public class TrendReportsController : ControllerBase
    {
        private readonly SplatContext _context;

        public TrendReportsController(SplatContext context)
        {
            _context = context;
        }

        // GET: api/trendreports/?DateFrom=value&DateTo=value
        /*
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<TrendReport>> GetTrendReport([FromQuery] DateRange timePeriod)
        {
            var reportPickups = GetPickupsWithinDateRange(await GetPickupsFromContext(_context), timePeriod);

            return await GenerateTrendReport(reportPickups, timePeriod);
        }

        public static async Task<TrendReport> GenerateTrendReport(IQueryable<Pickup> pickups, DateRange timePeriod)
        {
            return new TrendReport { Entries = GenerateTrendEntries(pickups, timePeriod) };
        }
        */
        public static TrendReport GenerateTrendReport(IQueryable<Pickup> pickups, DateRange timePeriod)
        {
            TrendReport report = new TrendReport { Entries = GenerateTrendEntries(pickups, timePeriod) };

            foreach (TrendEntry entry in report.Entries)
                FillTrendEntry(pickups, entry);

            return report;
        }

        // Methods for getting and parsing pickups from the DB
        static async Task<IQueryable<Pickup>> GetPickupsFromContext(SplatContext context)
        {
            return context.Pickups
                .Where(p => p.PickupStatus != PickupStatus.CANCELED);
        }

        static IQueryable<Pickup> GetPickupsWithinDateRange(IQueryable<Pickup> pickups, DateRange range)
        {
            return pickups
                .Where(p => p.SubmittedAt >= range.DateFrom && p.SubmittedAt <= range.DateTo);
        }

        // Methods for generating and filling TrendEntries and TrendItemEntries
        static List<TrendEntry> GenerateTrendEntries(IQueryable<Pickup> pickups, DateRange timePeriod)
        {
            List<ItemRequest> itemRequests = GetItemRequests(pickups);
            List<Category> categories = GetDistinctCategories(itemRequests);
            List<TrendEntry> trendEntries = new List<TrendEntry>();
            List<TrendItemEntry> unCategorizedEntries = GenerateTrendItemEntries(pickups, GetDistictItems(itemRequests), timePeriod);


            foreach (Category category in categories)
            {
                List<TrendItemEntry> itemEntries = new List<TrendItemEntry>();

                foreach(TrendItemEntry entry in unCategorizedEntries)
                {
                    if (category.Id.Equals(entry.Item.CategoryId))
                        itemEntries.Add(entry);
                }

                TrendEntry nextTrendEntry = new TrendEntry
                {
                    Category = category,
                    ItemEntries = itemEntries,
                    TimePeriod = timePeriod
                };

                trendEntries.Add(nextTrendEntry);
            }

            return trendEntries;
        }

        static List<TrendItemEntry> GenerateTrendItemEntries(IQueryable<Pickup> pickups, List<Item> items, DateRange timePeriod)
        {
            List<TrendItemEntry> trendItemEntries = new List<TrendItemEntry>(); 

            foreach(Item item in items)
            {
                TrendItemEntry nextItemEntry = new TrendItemEntry
                {
                    Item = item,
                    RequestBins = GenerateHistogramBins(GetListOfWeeks(timePeriod)),
                    Average = 0
                };

                FillTrendItemEntry(pickups, nextItemEntry);
                trendItemEntries.Add(nextItemEntry);
            }

            return trendItemEntries;
        }

        static List<RequestHistogramBin> GenerateHistogramBins(List<Week> weeks)
        {
            List<RequestHistogramBin> bins = new List<RequestHistogramBin>();

            foreach(Week week in weeks)
            {
                bins.Add(new RequestHistogramBin
                {
                    RequestedItemCount = 0,
                    Week = week
                });
            }

            return bins;
        }

        static void FillTrendEntry(IQueryable<Pickup> pickups, TrendEntry entry)
        {
            foreach (TrendItemEntry itemEntry in entry.ItemEntries)
                FillTrendItemEntry(pickups, itemEntry);
        }

        static void FillTrendItemEntry(IQueryable<Pickup> pickups, TrendItemEntry itemEntry)
        {
            int count = 0;
            double totalCount = 0;
            foreach(RequestHistogramBin weekBin in itemEntry.RequestBins)
            {
                List<ItemRequest> weeklyRequests = GetRequestsForGivenItemAndWeek(pickups, itemEntry.Item, weekBin.Week);
                count = CountItemRequestsForAGivenWeek(weeklyRequests);
                weekBin.RequestedItemCount = count;
                totalCount += count;
            }

            itemEntry.Average = totalCount / itemEntry.RequestBins.Count;
        }

        private static int CountItemRequestsForAGivenWeek(List<ItemRequest> itemRequests)
        {
            int count = 0;
            foreach (ItemRequest request in itemRequests)
                count += request.Quantity;

            return count;
        }

        static List<ItemRequest> GetItemRequests(IQueryable<Pickup> pickups)
        {
            List<ItemRequest> itemRequests = new List<ItemRequest>();

            foreach(Pickup pickup in pickups)
            {
                foreach (ItemRequest request in pickup.ItemRequests)
                    itemRequests.Add(request);
            }

            return itemRequests;
        }

        static List<Category> GetDistinctCategories(List<ItemRequest> itemRequests)
        {
            List<Category> categories = new List<Category>();

            foreach(ItemRequest request in itemRequests)
            {
                if (!categories.Contains(request.Item.Category, new CategoryComparitor()))
                    categories.Add(request.Item.Category);
            }

            return categories;
        }

        static List<Item> GetDistictItems(List<ItemRequest> itemRequests)
        {
            List<Item> items = new List<Item>();

            foreach (ItemRequest request in itemRequests)
            {
                if (!items.Contains(request.Item, new ItemComparitor()))
                    items.Add(request.Item);
            }

            return items;
        }

        public class ItemComparitor : IEqualityComparer<Item>
        {
            public bool Equals(Item x, Item y)
            {
                return x.Id.Equals(y.Id);
            }

            public int GetHashCode([DisallowNull] Item obj)
            {
                throw new NotImplementedException();
            }
        }

        public class CategoryComparitor : IEqualityComparer<Category>
        {
            public bool Equals(Category x, Category y)
            {
                return x.Id.Equals(y.Id);
            }

            public int GetHashCode([DisallowNull] Category obj)
            {
                throw new NotImplementedException();
            }
        }

        static List<ItemRequest> GetRequestsForGivenItemAndWeek(IQueryable<Pickup> pickups, Item item, Week week)
        {
            List<ItemRequest> requestsForItem = new List<ItemRequest>();

            var pickupsForWeek = pickups.Where(p => DateFallsWithinWeek(p.SubmittedAt, week));

            foreach(Pickup pickup in pickupsForWeek)
            {
                foreach (ItemRequest request in pickup.ItemRequests)
                {
                    if(request.Item.Id.Equals(item.Id))
                        requestsForItem.Add(request);
                }           
            }

            return requestsForItem;
        }

        static bool DateFallsWithinWeek(DateTime submittedAt, Week week)
        {
            bool IsLaterThan = submittedAt.CompareTo(week.DateFrom) >= 0;
            bool IsEarlierThan = submittedAt.CompareTo(week.DateTo) <= 0;

            return IsLaterThan && IsEarlierThan;
        }
        // Look up linq syntax for partition
        static List<Week> GetListOfWeeks(DateRange timePeriod)
        {
            List<Week> weeks = new List<Week>();
            WeeksInfo info = new WeeksInfo(timePeriod);
            int numFullWeeks = info.GetNumFullweeks(), nextDay = 1;
            DateTime startOfWeek = timePeriod.DateFrom, endOfWeek;

            try
            {
                weeks.Add(new Week(timePeriod.DateFrom, timePeriod.DateTo));
            }
            catch (Exception e)
            {
                for (int weekNunmber = 0; weekNunmber < numFullWeeks; weekNunmber++)
                {
                    endOfWeek = startOfWeek.AddDays(Week.WEEK.Days);
                    weeks.Add(new Week(startOfWeek, endOfWeek));
                    startOfWeek = endOfWeek.AddDays(nextDay);
                }
            }
            // Append the list with the short week
            int remainingDays = info.GetRemainingNumDays();
            endOfWeek = startOfWeek.AddDays(remainingDays);
            weeks.Add(new Week(startOfWeek, endOfWeek));

            return weeks;
        }
    }
}
