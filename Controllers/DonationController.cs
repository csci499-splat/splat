using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SPLAT.Models;

namespace SPLAT.Controllers
{
    public class DonationController : Controller
    {
        private readonly ILogger<LoginController> _logger;

        public DonationController(ILogger<LoginController> logger)
        {
            _logger = logger;
        }
        public IActionResult Donation()
        {
            if (!verifyActiveLogin()) { return View("~/Views/Login/Login.cshtml"); }


            List<Object> donationObject = DBConnection.fetch("SelectAllDonations");
            List<Donation> donations = new List<Donation>();
            for(int i = 0; i < donationObject.Count; i++)
            {
                donations.Add(new Donation((object[])donationObject[i]));
            }
            return View(donations);
        }
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Privacy()
        {
            return View();
        }
        public IActionResult AddDonation(Donation d = null)
        {
            if (!verifyActiveLogin()) { return View("~/Views/Login/Login.cshtml"); }
            if (d.Donator != null)
            {
                try
                {
                    List<SqlParameter> parameters = new List<SqlParameter>();
                    parameters.Add(new SqlParameter("@donator_name", d.Donator));
                    parameters.Add(new SqlParameter("@date", d.Date));
                    parameters.Add(new SqlParameter("@weight", d.Weight));
                    parameters.Add(new SqlParameter("@money_amount", d.Amount));
                    DBConnection.executeNonSelectProcedure("InsertDonation", parameters);
                    TempData["message"] = "The donation has been added successfully!";
                    return RedirectToAction("Donation");
                }
                catch
                {
                    TempData["message"] = "Error adding donation";
                }
            }
            return View();
        }

        public IActionResult EditDonation(Donation d)   //returns model data to "EditDonation" view
        {
            if (!verifyActiveLogin()) { return View("~/Views/Login/Login.cshtml"); }
            TempData["donator"] = d.Donator;
            TempData["datetime"] = d.Date.ToString();
            return View(d);
        }

        public IActionResult UpdateDonation(Donation model) //updates Donation (only weight and money amount can be changed)
        {
            if (!verifyActiveLogin()) { return View("~/Views/Login/Login.cshtml"); }
            if (model.Amount == 0 && model.Weight == 0) { TempData["message"] = "Missing amount or weight"; return View("EditDonation", model); }
            if (model.Donator == "" || model.Donator == null) { TempData["message"] = "Missing donator name"; return View("EditDonation", model); }
            if (model.Date == null || model.Date == null) { TempData["message"] = "Missing donation date"; return View("EditDonation", model); }

            DateTime oldDateTime = DateTime.Parse(TempData["datetime"].ToString());
            string donator = TempData["donator"].ToString();

            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@donator_name_old", donator));
            parameters.Add(new SqlParameter("@donator_name_new", model.Donator));
            parameters.Add(new SqlParameter("@date_old", oldDateTime));
            parameters.Add(new SqlParameter("@date_new", model.Date));
            parameters.Add(new SqlParameter("@weight", model.Weight));
            parameters.Add(new SqlParameter("@money_amount", model.Amount));
            try
            {
                DBConnection.getInstance();
                DBConnection.executeNonSelectProcedure("UpdateDonation", parameters);
                TempData["message"] = "The donation has been successfully updated.";
            }
            catch (Exception)
            {
                TempData["message"] = "Error updating donation";
                model.Donator = donator;
                model.Date = oldDateTime;
                return RedirectToAction("EditDonation", model);
            }
            return RedirectToAction("Donation");
        }


        public IActionResult DeleteDonation(Donation model)   //deletes a donation
        {
            if (!verifyActiveLogin()) { return View("~/Views/Login/Login.cshtml"); }
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@name", model.Donator));
            parameters.Add(new SqlParameter("@date", model.Date));
            try
            {
                DBConnection.getInstance();
                DBConnection.executeNonSelectProcedure("DeleteDonation", parameters);
                TempData["message"] = "The donation has been successfully deleted.";
            }
            catch (Exception e)
            {
                TempData["message"] = "Error deleting donation: " + e;
            }
            return RedirectToAction("Donation");
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
