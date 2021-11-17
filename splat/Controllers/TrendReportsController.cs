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
            var reportPickups = _context.Pickups
                .Where(p => p.SubmittedAt >= range.DateFrom && p.SubmittedAt <= range.DateTo)
                .Where(p => p.PickupStatus != PickupStatus.CANCELED);

            return await GenerateReport(reportPickups);
        }

        public static async Task<TrendReport> GenerateReport(IQueryable<Pickup> pickups)
        {
            var itemRequests = GetItemRequests(pickups);
            IEnumerable<TrendEntry> trendEntries = GenerateTrendEntries(itemRequests.ToList());
            return new TrendReport { Entries = trendEntries.ToArray<TrendEntry>() };
        }

        public static IEnumerable<ItemRequest[]> GetItemRequests(IQueryable<Pickup> pickups)
        {
            return new List<ItemRequest[]>(pickups.Select(p => p.ItemRequests).ToList());
        }

        public static IEnumerable<TrendEntry> GenerateTrendEntries(List<ItemRequest[]> itemRequests)
        {
            List<TrendEntry> trendEntries = GenerateEmptyTrendEntries(itemRequests);
            CountItemRequests(trendEntries, itemRequests);

            return trendEntries;
        }

        static List<TrendEntry> GenerateEmptyTrendEntries(List<ItemRequest[]> itemRequests)
        {
            List<TrendEntry> trendEntries = new List<TrendEntry>();

            foreach(ItemRequest[] requests in itemRequests)
            {
                foreach (ItemRequest request in requests)
                    if (!EntryForItemExists(trendEntries, request.Item))
                        trendEntries.Add(new TrendEntry { Item = request.Item, RequestCount = 0 });

            }

            return trendEntries;
        }

        static void CountItemRequests(List<TrendEntry> trendEntries, List<ItemRequest[]> itemRequests)
        {
            foreach (ItemRequest[] requests in itemRequests)
            {
                foreach (ItemRequest request in requests)
                {
                    foreach (TrendEntry entry in trendEntries)
                    {
                        if (entry.Item.Equals(request.Item))
                        {
                            entry.RequestCount += request.Quantity;
                        }
                    }
                }
            }
        }

        static bool EntryForItemExists(List<TrendEntry> trendEntries, Item item)
        {
            foreach(TrendEntry entry in trendEntries)
            {
                if (entry.Item.Equals(item))
                    return true;
            }

            return false;
        }
    }
}
