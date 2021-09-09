using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SPLAT.Models
{
    public class Discard
    {
        private DateTime date;
        private double weight;
        private string reason;

        public Discard() { }

        public Discard(DateTime date, double weight, string reason)
        {
            this.Date = date;
            this.Weight = weight;
            this.Reason = reason;
        }

        public DateTime Date { get => date; set => date = value; }
        public double Weight { get => weight; set => weight = value; }
        public string Reason { get => reason; set => reason = value; }
    }
}
