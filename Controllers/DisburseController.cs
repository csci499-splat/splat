using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SPLAT.Models;
using Microsoft.AspNetCore.Http;

namespace SPLAT.Controllers
{
    public class DisburseController : Controller
    {
        private readonly ILogger<LoginController> _logger;

        public DisburseController(ILogger<LoginController> logger)
        {
            _logger = logger;
        }
        public IActionResult Disburse(Request r)
        {
            if (!verifyActiveLogin()) { return View("~/Views/Login/Login.cshtml"); }
            return View(r);
        }
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
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