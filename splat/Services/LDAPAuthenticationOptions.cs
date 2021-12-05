using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace splat.Services
{
    public class LDAPAuthenticationOptions
    {
        public string LDAPServer { get; set; }
        public string Account { get; set; }
        public string Password { get; set; }
    }
}
