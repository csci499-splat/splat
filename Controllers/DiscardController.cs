using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SPLAT.Models;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace SPLAT.Controllers
{
    public class DiscardController : Controller
    {
        private readonly ILogger<DiscardController> _logger;

        public DiscardController(ILogger<DiscardController> logger)
        {
            _logger = logger;
        }
        public IActionResult Discard()
        {
            if (!verifyActiveLogin()) { return View("~/Views/Login/Login.cshtml"); }
            List<Discard> discards = DBConnection.SelectAllDiscards();     
            return View(discards);
        }
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }
        public IActionResult CreateDiscard()
        {
            if (!verifyActiveLogin()) { return View("~/Views/Login/Login.cshtml"); }
            return View();
        }

        public IActionResult AddDiscard(Discard d)
        {
            if (!verifyActiveLogin()) { return View("~/Views/Login/Login.cshtml"); }

            if (d.Date == null) { TempData["message"] = "Please specify a date!"; return RedirectToAction("CreateDiscard"); }
            if (d.Weight == 0) { TempData["message"] = "Please specify a weight!"; return RedirectToAction("CreateDiscard"); }
            if (d.Reason == null) { TempData["message"] = "Please specify a reason!"; return RedirectToAction("CreateDiscard"); }

            try
            {
                List<SqlParameter> parameters = new List<SqlParameter>();
                parameters.Add(new SqlParameter("@staff_username", "admin"));
                parameters.Add(new SqlParameter("@date", d.Date));
                parameters.Add(new SqlParameter("@weight", d.Weight));
                parameters.Add(new SqlParameter("@reason", d.Reason));
                DBConnection.executeNonSelectProcedure("InsertDiscard", parameters);
                TempData["message"] = "Discard processed successfully!";
                return RedirectToAction("Discard");
            }
            catch (SqlException)
            {
                TempData["message"] = "Database error while processing discard (possible duplicate)!";
                return RedirectToAction("CreateDiscard");
            }
            catch
            {
                TempData["message"] = "Error processing discard!";
                return RedirectToAction("CreateDiscard");
            }
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        public bool verifyActiveLogin()
        {
            if (TempData.Peek("Username") == null) { return false; }
            return true;
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult CheckInformation(Request reg)
        {
            if (!verifyActiveLogin()) { return View("~/Views/Login/Login.cshtml"); }
            return View("Discard");
        }
    }
}

