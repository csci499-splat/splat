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

            body.Append("<p>Problems? The contact information for the Director of Student Development can be found below.</p>");
            body.Append("<p>Jennifer Bird<br>Director of Student Development<br><a href=\"mailto:jbird2@uwsuper.edu\">jbird2@uwsuper.edu</a>");
            body.Append("<br><a href=\"tel:7153948571\">715-394-8571</a></p>");

            return body.ToString();
        }

        public override string GetMessageSubject()
        {
            return "UW-Superior Food Pantry - Thanks!";
        }
    }
}
