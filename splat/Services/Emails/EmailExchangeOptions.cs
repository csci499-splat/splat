using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace splat.Services.Emails
{
    public class EmailExchangeOptions
    {
        public string Sender { get; set; }
        public string SMTPServerHost { get; set; }
        public int SMTPPort { get; set; }
        public string SMTPServerUser { get; set; }
        public string SMTPServerPassword { get; set; }
    }
}
