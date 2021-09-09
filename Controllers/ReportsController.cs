using System;
using System.IO;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SPLAT.Models;
using System.Drawing;

namespace SPLAT.Controllers
{
    public class ReportsController : Controller
    {
        private readonly ILogger<LoginController> _logger;

        public ReportsController(ILogger<LoginController> logger)
        {
            _logger = logger;
        }
        public IActionResult Reports()
        {
            if (!verifyActiveLogin()) { return View("~/Views/Login/Login.cshtml"); }

            return View();
        }
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }
        
        [HttpPost]
        //[ValidateAntiForgeryToken]
        public String ConvertToExcel(String endDatestr, String startDatestr)
        {
            String savePath = @"C:\Users\Public\Documents\SPLAT_Excel";
            DateTime startDate = DateTime.Parse(startDatestr);
            DateTime endDate = DateTime.Parse(endDatestr);
            TotalsReport report = new TotalsReport(endDate, startDate);
            string filename = "TotalReport" + "_" + report.StartDate.Year  + "-" + report.StartDate.Month + ".csv";
            string saveAsName = filename.Substring(filename.LastIndexOf('\\') + 1);
            String fullPath = Path.Combine(savePath, filename);
            if (!Directory.Exists(savePath))
            {
                Directory.CreateDirectory(savePath);
            }
            using (StreamWriter sw = new StreamWriter(fullPath))
            {
                String s = report.StartDate.ToString("MMMM") + "\n" + "Food Weight,Fulfillments,People Impacted,Recurring Visits,Individual Visits\n";
                s += report.TotalFoodWeight + "," + report.TotalFulfillments + "," + (report.TotalHousehold + report.TotalIndividualVisits) + "," + report.RecurringVisits + "," + report.TotalIndividualVisits;
                sw.Write(s);
            }
            return filename;
        }
        public ActionResult DownloadExcel(String filename)
        {
            if (!verifyActiveLogin()) { return View("~/Views/Login/Login.cshtml"); }

            String savePath = @"C:\Users\Public\Documents\SPLAT_Excel";
            String fullPath = Path.Combine(savePath, filename);
            byte[] fileByteArray = System.IO.File.ReadAllBytes(fullPath);
            System.IO.File.Delete(fullPath);    // delete the excel file
            return File(fileByteArray, "text/csv", filename);
        }
        public IActionResult GenerateReport(DateTime reportStart, String reportSelected, string itemSelected)
        {
            if (!verifyActiveLogin()) { return View("~/Views/Login/Login.cshtml"); }

            if (reportSelected.Equals("Total"))
            {
                DateTime reportEnd = reportStart.AddDays(DateTime.DaysInMonth(reportStart.Year, reportStart.Month) - 1);
                TotalsReport report = new TotalsReport(reportEnd, reportStart);
                return View("TotalsReport", report);
            }
            else if (reportSelected.Equals("Trend"))
            {
                ItemCategory itemCategory = new ItemCategory(itemSelected);
                return (TrendReport(reportStart, itemCategory));
            }
            return View("Reports");
        }
        public IActionResult TotalsReport(TotalsReport report)
        {
            if (!verifyActiveLogin()) { return View("~/Views/Login/Login.cshtml"); }

            return View(report);
        }

        public IActionResult TrendReport(DateTime startDate, ItemCategory category)
        {
            if (!verifyActiveLogin()) { return View("~/Views/Login/Login.cshtml"); }

            try
            {
                TrendReport tr = new TrendReport(category, startDate);
                tr.GenerateTrendReport();

                TrendSketcher sketcher = new TrendSketcher(tr);
                sketcher.SketchImage();
                return View("TrendReport");
            }
            catch (Exception e)
            {
                if (e.Message == "incorrectStartDate") { TempData["message"] = "Start date must be at least 2mo in the past"; }
                else { TempData["message"] = "Error drawing report! " + e; }
                return View("Reports");
            }
        }

        public IActionResult RenderImage()
        {
            if (!verifyActiveLogin()) { return View("~/Views/Login/Login.cshtml"); }

            string path = @"C:\Users\Public\Documents\trendReport.bmp";
            byte[] imageByteData = System.IO.File.ReadAllBytes(path);
            return File(imageByteData, "image/bmp");
            //return File(path, "image/bmp");
        }

        public bool verifyActiveLogin()
        {
            if (TempData.Peek("Username") == null) { return false; }
            return true;
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
