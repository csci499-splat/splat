using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace splat.Models
{
    [Keyless]
    public class TotalReport
    {
        public double FoodWeight { get; set; }
        public int Disbursements { get; set; }
        public int PeopleImpacted { get; set; }
        public int RecurringVisits { get; set; }
        public int IndividualVisits { get; set; }
    }
}
