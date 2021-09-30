using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace splat.Models
{
    public class Student
    {
        public string StudentId { get; set; }
        public int Age { get; set; }
        public bool OnMealPlan { get; set; }
    }
}
