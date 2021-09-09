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
    public class ViewRequestsController : Controller
    {
        private readonly ILogger<LoginController> _logger;

        public ViewRequestsController(ILogger<LoginController> logger)
        {
            _logger = logger;
        }
        public IActionResult ViewRequests()
        {
            return View("RequestSearch");
        }

        public IActionResult ShowRequests(string studentID = "3318234")
        {
            /*if (TempData["Username"] == null)
            {
                return View("~/Views/Login/Login.cshtml");
            }
            TempData["Username"] = TempData["Username"];
            ViewBag.Message = TempData["message"];*/
            List<Request> pendingRequests = new List<Request>();
            try
            {
                pendingRequests = DBConnection.fetchPendingRequestsByStudentID(studentID);
            }
            catch { }
            return View("ViewRequests", pendingRequests);
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        public IActionResult Edit(Request r)
        {
            return View(r);
        }
        public IActionResult Disburse(Request r)
        {
            r = DBConnection.selectRequest(r.studentID, r.TimeOfPickup);
            return View(r);
        }
        /*public IActionResult updateRequest(Request model)
        {
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@student_id_old", model.studentID));
            parameters.Add(new SqlParameter("@student_id_new", model.studentID));
            parameters.Add(new SqlParameter("@date_start_old", model.timeOfPickup));
            parameters.Add(new SqlParameter("@date_start_new", model.timeOfPickup));
            parameters.Add(new SqlParameter("@weight", model.totalWeightDistributed));
            parameters.Add(new SqlParameter("@status", "complete"));
            try
            {
                DBConnection.executeNonSelectProcedure("UpdateDisbursement", parameters);
                TempData["message"] =  "The request has been successfully updated.";
            }
            catch(SystemException e)
            {
                TempData["message"] = "Unable to update the request.\n" + e;
            }
            return RedirectToAction("ViewRequests");
        }*/

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
