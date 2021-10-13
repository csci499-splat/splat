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

        public double TotalWeight()
        {
            var weight = 0.0;
            foreach (Pickup p in _context.Pickups.ToArray()){
                if (p.Weight == null) continue;
                else
                {
                    weight += (double)p.Weight;
                }
            }
            return weight;
        }

        public int TotalDisbursements()
        {
            return _context.Pickups.ToArray().Length;
        }

        public int TotalPeopleImpacted()
        {
            var total = 0;
            foreach(Pickup p in _context.Pickups.ToArray())
            {
                var currentPickup = p.HouseholdInfo.NumAdults + p.HouseholdInfo.NumMinors + p.HouseholdInfo.NumSeniors;
                total += currentPickup;
            }
            return total;
        }

        public int TotalRecurringVisits()
        {
            Pickup[] arr = _context.Pickups.ToArray();
            List<Pickup> total = new List<Pickup>();
            for(int i = 0; i < arr.Length -1; i++)
            {
                for (int j = i + 1; j < arr.Length; j++)
                {
                    if(arr[i] == arr[j])
                    {
                        if(total.Contains(arr[i]))
                        {
                            break;
                        }
                        else total.Add(arr[i]);
                    }
                }
            }

            return total.Count;
        }

        public int TotalIndividualVisits()
        {
            Pickup[] arr = _context.Pickups.ToArray();
            List<Pickup> total = new List<Pickup>();
            for (int i = 0; i < arr.Length; i++)
            {
                if (total.Contains(arr[i]))
                {
                    break;
                }
                else total.Add(arr[i]);
            }
            return total.Count;
        }
    }
}
