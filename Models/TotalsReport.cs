using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace SPLAT.Models
{
    public class TotalsReport
    {
        private DateTime endDate;
        private DateTime startDate;
        private int recurringVisits;
        private double totalFoodWeight;
        private int totalFulfillments;
        private int totalHousehold;
        private int totalIndividualVisits;
        private int[] totalIndividualAgeCategory;
        private int[] totalHouseholdAgeCategory;
        private string endDatestr;
        private string startDatestr;

        public string EndDatestr { get => endDatestr; set => endDatestr = value; }
        public string StartDatestr { get => startDatestr; set => startDatestr = value; }
        public DateTime EndDate { get => endDate; set => endDate = value; }
        public DateTime StartDate { get => startDate; set => startDate = value; }
        public int RecurringVisits { get => recurringVisits; set => recurringVisits = value; }
        public double TotalFoodWeight { get => totalFoodWeight; set => totalFoodWeight = value; }
        public int TotalFulfillments { get => totalFulfillments; set => totalFulfillments = value; }
        public int TotalIndividualVisits { get => totalIndividualVisits; set => totalIndividualVisits = value; }
        public int TotalHousehold { get => totalHousehold; set => totalHousehold = value; }
        public int[] TotalIndividualAgeCategory { get => totalIndividualAgeCategory; set => totalIndividualAgeCategory = value; }
        public int[] TotalHouseholdAgeCategory { get => totalHouseholdAgeCategory; set => totalHouseholdAgeCategory = value; }

        public TotalsReport(DateTime endDate, DateTime startDate)
        {
            this.endDate = endDate;
            this.startDate = startDate;
            totalIndividualAgeCategory = new int[3];
            totalHouseholdAgeCategory = new int[3];
            Request[] requests = fetchRequests();
            calcUniqueVisits(requests);
            calcRecurringVisits(requests);
            totalDispursedFood(requests);
            calcTotalFulfillments(requests);
        }
        private void calcRecurringVisits(Request[] requests)
        {
            RecurringVisits = requests.Length - totalIndividualVisits;
        }
        private void totalDispursedFood(Request[] requests)
        {
            for (int i = 0; i < requests.Length; i++)
            {
                totalFoodWeight += requests[i].TotalWeightDistributed;
            }
        }
        private void calcTotalFulfillments(Request[] requests)
        {
            totalFulfillments = requests.Length;
        }

        private void calcUniqueVisits(Request[] requests)
        {
            List<String> UniqueIds = new List<String>();

            int teen = 0;
            int adult = 1;
            int senior = 2;

            for (int i = 0; i < requests.Length; i++)
            {
                bool containsID = false;
                for (int j = 0; j < UniqueIds.Count; j++)
                {
                    if (UniqueIds[j].Equals(requests[i].StudentID))
                        containsID = true;
                }
                if (containsID == false)
                {
                    UniqueIds.Add(requests[i].StudentID);
                    totalHouseholdAgeCategory[teen] += requests[i].HouseholdAgeCategoryMinor;
                    totalHouseholdAgeCategory[adult] += requests[i].HouseholdAgeCategoryAdult;
                    totalHouseholdAgeCategory[senior] += requests[i].HouseholdAgeCategorySenior;
                    switch (requests[i].RequestorAgeCategory)
                    {
                        case "0-17":
                            totalIndividualAgeCategory[teen]++;
                            break;
                        case "18-64":
                            totalIndividualAgeCategory[adult]++;
                            break;
                        case "64+":
                            totalIndividualAgeCategory[senior]++;
                            break;
                    }
                }
            }
            for (int i = 0; i < totalHouseholdAgeCategory.Length; i++)
            {
                totalHousehold += totalHouseholdAgeCategory[i];
                totalIndividualVisits += totalIndividualAgeCategory[i];
            }
        }
        private Request[] fetchRequests()
        {
            List<SqlParameter> reportDates = new List<SqlParameter>();
            reportDates.Add(new SqlParameter("@date1", startDate));
            reportDates.Add(new SqlParameter("@date2", endDate));
            List<Object> requestObjects = DBConnection.fetch("GetCompleteDisbursement", reportDates);
            Request[] requests = new Request[requestObjects.Count];
            for (int i = 0; i < requestObjects.Count; i++)
            {
                requests[i] = new Request((object[])requestObjects[i]);
            }
            return requests;
        }
    }
}
