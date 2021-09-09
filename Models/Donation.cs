using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SPLAT.Models
{
    public class Donation
    {
        private double amount;
        private DateTime date;
        private double weight;
        private string donator;
        //private bool isIndividual;

        public double Amount { get => amount; set => amount = value; }
        public DateTime Date { get => date; set => date = value; }
        public double Weight { get => weight; set => weight = value; }
        public string Donator { get => donator; set => donator = value; }
        //public bool IsIndividual { get => isIndividual; set => isIndividual = value; }

        public Donation() { }
        public Donation(double amount, DateTime date, double weight, string donator)
        {
            this.amount = amount;
            this.date = date;
            this.weight = weight;
            this.donator = donator;
        }
        public Donation(Object[] parameters)
        {
            this.Donator = parameters[0].ToString();
            this.date = (DateTime)parameters[1];
            this.weight = Decimal.ToDouble((decimal)parameters[2]);
            this.Amount = Decimal.ToDouble((decimal)parameters[3]);
        }
    }

}
