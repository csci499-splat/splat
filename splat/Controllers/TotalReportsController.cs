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
        public async Task<ActionResult<TotalReport>> GetTotalReport()
        {
            var pickups = _context.Pickups;

            return new TotalReport 
            {
                FoodWeight = await GetTotalWeight(pickups),
                Disbursements = await TotalDisbursements(pickups),
                PeopleImpacted = await TotalPeopleImpacted(pickups),
                RecurringVisits = await TotalRecurringVisits(pickups),
                IndividualVisits = await TotalIndividualVisits(pickups)
            };
        }

        public async Task<double> GetTotalWeight(IQueryable<Pickup> pickups)
        {
            return (double)await pickups.SumAsync(p => p.Weight);
        }

        public async Task<int> TotalDisbursements(IQueryable<Pickup> pickups)
        {
            return await pickups.Where(p => p.PickupStatus == PickupStatus.DISBURSED).CountAsync();
        }

        public async Task<int> TotalPeopleImpacted(IQueryable<Pickup> pickups)
        {
            var disbursedPickups = pickups.Where(p => p.PickupStatus == PickupStatus.DISBURSED);
            var students = await disbursedPickups.GroupBy(p => p.StudentInfo.StudentId).CountAsync();
            var result = await disbursedPickups.SumAsync(p => p.HouseholdInfo.NumAdults + p.HouseholdInfo.NumMinors + p.HouseholdInfo.NumSeniors);
            return result + students;
        }

        public Task<int> TotalRecurringVisits(IQueryable<Pickup> pickups)
        {
            return pickups.Select(p => p.StudentInfo.StudentId).Distinct().CountAsync();
        }

        public Task<int> TotalIndividualVisits(IQueryable<Pickup> pickups)
        {
            var disbursedPickups = pickups.Where(p => p.PickupStatus == PickupStatus.DISBURSED);
            return disbursedPickups.GroupBy(p => p.StudentInfo.StudentId).CountAsync();        
        }
    }
}
