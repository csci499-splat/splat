using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Logging;
using SPLAT.Models;

namespace SPLAT.Controllers
{
    public class RequestController : Controller
    {
        private readonly ILogger<LoginController> _logger;

        public RequestController(ILogger<LoginController> logger)
        {
            _logger = logger;
        }
        public IActionResult RequestForm()
        {
            return View("Request");
        }
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public string SubmitRequestForm([FromBody] string args)
        {
            int STUDENT_ID_LENGTH = 7;
            Request req = new Request();
            try
            {
                req.ParseRequest(args);
            }
            catch (Exception e)
            {
                return e.Message;
            }

            if (req.StudentID.Length != STUDENT_ID_LENGTH)
            {
                return "Invalid student ID. Student IDs should have " + STUDENT_ID_LENGTH + " digits";
            }
            if (req.HouseholdAgeCategoryAdult < 0 || req.HouseholdAgeCategoryMinor < 0 || req.HouseholdAgeCategorySenior < 0)
            {
                return "One or more of OTHERS in HOUSEHOLD is negative";
            }
            if (req.TimeOfPickup < DateTime.Today)
            {
                return "Date/time of pickup cannot be in the past";
            }
            if (req.requestedItems.Length == 0)
            {
                return "There is no selected item. Please select item(s) you want to request";
            }
            if(!SPLAT.Models.Request.IsDuringPantryHours(req.TimeOfPickup))
            {
                return "Date/time of pickup chosen is not during a pantry hour";
            }

            try
            {
                List<SqlParameter> parameters = req.GetParameterList();
                DBConnection.executeNonSelectProcedure("InsertRequest", parameters);
            }
            catch (Exception e)
            {
                return "Request was submitted unsuccessfully. " + e.Message;
            }
            return "success";
        }
    }
}
