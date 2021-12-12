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
    [Authorize(Policy = "ElevatedRights")]
    public class TotalReportsController : ControllerBase
    {
        private readonly SplatContext _context;

        public TotalReportsController(SplatContext context)
        {
            _context = context;
        }

        // GET: api/TotalReports
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<TotalReport>> GetTotalReport([FromQuery] DateRange dates)
        {
            var pickups = _context.Pickups
                .Where(p => p.PickupStatus == PickupStatus.DISBURSED)
                .Where(p => p.PickupTime >= dates.DateFrom && p.PickupTime <= dates.DateTo);

            return new TotalReport 
            {
                FoodWeight = await GetTotalWeight(pickups),
                Disbursements = await TotalDisbursements(pickups),
                PeopleImpacted = await TotalPeopleImpacted(pickups),
                RecurringVisits = await TotalRecurringVisits(pickups),
                IndividualVisits = await TotalIndividualVisits(pickups)
            };
        }

        public static async Task<double> GetTotalWeight(IQueryable<Pickup> pickups)
        {
            return (double)await pickups.SumAsync(p => p.Weight);
        }

        public static async Task<int> TotalDisbursements(IQueryable<Pickup> pickups)
        {
            return await pickups.CountAsync();
        }

        public static async Task<int> TotalPeopleImpacted(IQueryable<Pickup> pickups)
        {
            var students = await pickups.GroupBy(p => p.StudentInfo.StudentId).CountAsync();
            var result = await pickups
                .SumAsync(p => p.HouseholdInfo.NumAdults + p.HouseholdInfo.NumMinors + p.HouseholdInfo.NumSeniors);
            return result + students;
        }

        public static Task<int> TotalRecurringVisits(IQueryable<Pickup> pickups)
        {
            return pickups
                .GroupBy(p => p.StudentInfo.StudentId)
                .Where(p => p.Count() > 1)
                .CountAsync();
        }

        public static Task<int> TotalIndividualVisits(IQueryable<Pickup> pickups)
        {
            return pickups
                .GroupBy(p => p.StudentInfo.StudentId)
                .CountAsync();        
        }
    }
}
