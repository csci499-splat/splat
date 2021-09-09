using System;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SPLAT.Models;
using Microsoft.AspNetCore.Http;
using System.Security.Cryptography;
using System.Data.SqlClient;

namespace SPLAT.Controllers
{
    public class LoginController : Controller
    {
        private readonly ILogger<LoginController> _logger;

        public LoginController(ILogger<LoginController> logger)
        {
            _logger = logger;
        }

        public IActionResult Login()
        {
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

        [HttpGet]
        public string GetPublicKey()
        {
            try
            {
                SplatCrypto.GetInstance();
                return SplatCrypto.GetPublicKey();
            }
            catch(Exception ex)
            {
                return ex.ToString();
            }
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public string AuthenticateStaff(Staff staff)
        {
            if (!ModelState.IsValid) { return "error"; }
            if (staff.Username == "" || staff.Password == "") { return "error"; }
            try
            {
                SplatCrypto.GetInstance();
                byte[] byteme = Convert.FromBase64String(staff.Password);
                string decryptedPassword = SplatCrypto.Decrypt(byteme);
                staff.Password = decryptedPassword;

                if (!SplatCrypto.AuthenticateStaffSecure(staff))  //login unsuccessful
                {
                    return "invalidCreds";
                }
                TempData["Username"] = staff.Username;
                ////TempData["logindate"] = DateTime.Now.Date;
                ////TempData["logintime"] = DateTime.Now.TimeOfDay;                    
                return "success";
            }
            catch (CryptographicException) { return "encryptError"; }
            catch (SqlException) { return "sqlError"; }
            catch { return "error"; }
        }

        public IActionResult Logout()
        {
            // TempData.Clear();
            TempData.Remove("Username");            
            return View("Login");
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}