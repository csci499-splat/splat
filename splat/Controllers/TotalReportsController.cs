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
        public TotalReport GetTotalReport()
        {
            TotalReport totalReport = new TotalReport();
            totalReport.FoodWeight = TotalWeight();
            totalReport.Disbursements = TotalDisbursements();
            totalReport.PeopleImpacted = TotalPeopleImpacted();
            totalReport.RecurringVisits = TotalRecurringVisits();
            totalReport.IndividualVisits = TotalIndividualVisits();
            return totalReport;
        }

        public async Task<double> GetTotalWeight(IQueryable<Pickup> pickups)
        {
            return (double)await pickups.SumAsync(p => p.Weight);
        }

        public async Task<int> TotalDisbursements(IQueryable<Pickup> pickups)
        {
            return await pickups.Where(p => p.PickupStatus == p.PickupStatus.DISBURSED).Count();
        }

        public async Task<int> TotalPeopleImpacted(IQueryable<Pickup> pickups)
        {
            var students = await pickups.GroupBy(p => p.StudentInfo.StudentId).Where(p => p.PickupStatus == p.PickupStatus.DISBURSED && ).Count();
            var numHousehold = await pickups.GroupBy(p => p.StudentInfo.StudentId).Where(p => p.PickupStatus == p.PickupStatus.DISBURSED).SumAsync(p => p.HouseholdInfo.NumAdults || p.HouseholdInfo.NumMinors || p.HouseholdInfo.NumSeniors);
            return students + numHousehold;
        }

        public Task<int> TotalRecurringVisits(IQueryable<Pickup> pickups)
        {
            return pickups.Where(p => p.PickupStatus == p.PickupStatus.DISBURSED).Count().Having()
        }

        public Task<int> TotalIndividualVisits(IQueryable<Pickup> pickups)
        {
            return pickups.Distinct(p => p.StudentInfo.StudentId).Where(p => p.PickupStatus == p.PickupStatus.DISBURSED).Count(p => p.StudentInfo.Id).Where(p => p.StudentInfo.Id > 1).SumAsync();
        }
    }
}
