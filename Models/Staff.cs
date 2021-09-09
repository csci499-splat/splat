using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace SPLAT.Models
{
    public class Staff
    {
        private string username;
        private string password;
        private string salt;
        private bool isAdmin;

        public string Username { get => username; set => username = value; }
        public string Password { get => password; set => password = value; }
        public string Salt { get => salt; set => salt = value; }
        public bool IsAdmin { get => isAdmin; set => isAdmin = value; }

        public Staff()
        {

        }

        public Staff(string username, string password)
        {
            this.username = username;
            this.password = password;
        }
        public Staff(string username, string password, string salt, bool isAdmin)
        {
            this.username = username;
            this.password = password;
            this.salt = salt;
            this.isAdmin = isAdmin;
        }
    }
}
