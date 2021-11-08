using System;
using System.Collections.Generic;
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
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<TrendReport>> GetTrendReport([FromQuery] DateRange range)
        {
            var reportPickups = GetPickupsWithinDateRange(GetPickupsFromContext(_context), range);

            return await GenerateReport(reportPickups);
        }

        public static async Task<TrendReport> GenerateReport(IQueryable<Pickup> pickups)
        {
            return new TrendReport { };
        }

        public static IEnumerable<ItemRequest[]> GetItemRequestsInWeek(IQueryable<Pickup> pickups, Week week)
        {
            IQueryable<Pickup> pickupsInWeek = GetPickupsInWeek(pickups, week);

            return new List<ItemRequest[]>(pickupsInWeek.Select(p => p.ItemRequests).ToList());
        }

        // PRIVATE  METHODS
        // Methods for getting and parsing pickups from the DB
        private static IQueryable<Pickup> GetPickupsFromContext(SplatContext context)
        {
            return context.Pickups
                .Where(p => p.PickupStatus != PickupStatus.CANCELED);
        }

        private static IQueryable<Pickup> GetPickupsWithinDateRange(IQueryable<Pickup> pickups, DateRange range)
        {
            return pickups
                .Where(p => p.SubmittedAt >= range.DateFrom && p.SubmittedAt <= range.DateTo);
        }

        private static IQueryable<Pickup> GetPickupsInWeek(IQueryable<Pickup> pickups, Week week)
        {
            return pickups
                .Where(p => p.SubmittedAt >= week.DateFrom && p.SubmittedAt <= week.DateTo);
        }

        // Methods for generating TrendEntries

        private static TrendEntry GenerateTrendEntryForItem(ItemRequest[] itemRequests)
        {
            Item entryItem;
            if (!RequestsAreForSingleItem(itemRequests))
                throw new Exception("Requests for single trend entry are not all the same item!");
            entryItem = itemRequests[0].Item;   

            return new TrendEntry();
        }

        private static List<TrendEntry> GenerateEmptyTrendEntries(List<ItemRequest[]> itemRequests)
        {
            List<TrendEntry> trendEntries = new List<TrendEntry>();

            return trendEntries;
        }

        private static int CountItemRequests(ItemRequest[] itemRequests)
        {
            int count = 0;
            foreach (ItemRequest request in itemRequests)
                count += request.Quantity;

            return count;
        }

        private static bool EntryForItemExists(List<TrendEntry> trendEntries, Item item)
        {
            foreach (TrendEntry entry in trendEntries)
            {
                if (entry.Item.Equals(item))
                    return true;
            }

            return false;
        }

        private static bool RequestsAreForSingleItem(ItemRequest[] itemRequests)
        {
            Item shouldAllBe = itemRequests[0].Item;

            for (int i = 0; i < itemRequests.Length; i++)
            {
                if (!itemRequests[i].Item.Equals(shouldAllBe))
                    return false;
            }

            return true;
        }
    }
}
