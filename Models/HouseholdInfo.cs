using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace splat.Models
{
    public class HouseholdInfo
    {
        [Range(0, 10)]
        public int NumSeniors { get; set; }
        [Range(0, 10)]
        public int NumAdults { get; set; }
        [Range(0, 10)]
        public int NumMinors { get; set; }
    }
}
