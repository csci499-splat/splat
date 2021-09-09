using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SPLAT.Models;

namespace SPLAT.Controllers
{
    public class Account_ManagementController : Controller
    {
        private readonly ILogger<LoginController> _logger;

        public Account_ManagementController(ILogger<LoginController> logger)
        {
            _logger = logger;
        }  
        public IActionResult Account_Management()
        {
            if (!verifyActiveLogin()) { return View("~/Views/Login/Login.cshtml"); }
            ViewBag.Message = TempData["message"];
            List<Staff> accounts = DBConnection.fetchStaff();
            return View(accounts);
        }
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Privacy()
        {
            return View();
        }

        public IActionResult PasswordResetPage(string username)
        {
            if (!verifyActiveLogin()) { return View("~/Views/Login/Login.cshtml"); }
            ViewBag.selectedUser = username;
            return View("PasswordReset");
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public string ResetPassword(string selectedUser, string newPassword)
        {
            if (!verifyActiveLogin()) { return "error"; }
            if (!ModelState.IsValid) { return "error"; }
            if (newPassword == "") { return "error"; }
            Regex regexDigit = new Regex("[0-9]+");        //password contains at least one number
            Regex regexLetter = new Regex("[a-zA-Z]+");    //password contains at least one letter
            string username = TempData["Username"].ToString();
            TempData["Username"] = TempData["Username"];

            try
            {
                SplatCrypto.GetInstance();
                if (!SplatCrypto.AdminExists(username)) { return "invalidPriv"; }   //ensure logged-in user is admin
                byte[] byteme = Convert.FromBase64String(newPassword);
                string decryptedNewPassword = SplatCrypto.Decrypt(byteme);
                if (decryptedNewPassword.Length < 8) { return "lengthError"; }
                if (!regexDigit.IsMatch(decryptedNewPassword)) { return "digitError"; }
                if (!regexLetter.IsMatch(decryptedNewPassword)) { return "letterError"; }

                Staff staff = new Staff(); 
                staff.Username = selectedUser;
                if (!SplatCrypto.ResetPassword(staff, decryptedNewPassword))
                {
                    return "errorSettingPassword";
                }                
                return "success";
            }
            catch (CryptographicException) { return "encryptError"; }
            catch (SqlException) { return "sqlError"; }
            catch { return "error"; }
        }

        public bool verifyActiveLogin()
        {
            if (TempData["Username"] == null)
            {
                return false;
            }
            TempData["Username"] = TempData["Username"];
            return true;
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
