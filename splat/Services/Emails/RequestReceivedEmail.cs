using splat.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace splat.Services.Emails
{
    public class RequestReceivedEmail : EmailBase
    {
        private readonly EmailExchangeOptions _emailExchangeOptions;

        public RequestReceivedEmail(Pickup pickup, EmailExchangeOptions options) :
            base(pickup, options)
        {
            _emailExchangeOptions = options;
        }

        public override string CreateMessageBody()
        {
            var body = new StringBuilder("<html><body>");
            body.AppendFormat("<h1>We have received your request</h1>");

            return HttpUtility.HtmlEncode(body);
        }
    }
}
