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

        public override string ToString()
        {
            return string.Format("Sender={0}; Host={1}; Port={2}; User={3}; Password={4}", Sender,
                SMTPServerHost, SMTPPort, SMTPServerUser, SMTPServerPassword);
        }
    }
}
