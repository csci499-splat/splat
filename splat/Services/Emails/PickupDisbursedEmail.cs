using splat.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace splat.Services.Emails
{
    public class PickupDisbursedEmail : EmailBase
    {
        public PickupDisbursedEmail(Pickup pickup, EmailExchangeOptions options) :
            base(pickup, options)
        { }

        public override string GetMessageBody()
        {
            var body = new StringBuilder();
            body.Append("<h3>Thank you for picking up your requested items</h3>");
            body.Append("<p>- The UWS Food Pantry</p>");

            return body.ToString();
        }
    }
}
