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
        public RequestReceivedEmail(Pickup pickup, EmailExchangeOptions options) :
            base(pickup, options)
        { }

        public override string GetMessageBody()
        {
            var body = new StringBuilder();
            body.Append("<h3>We have received your request for the following items:</h3>");
            body.Append("<table role=\"presentation\" width=\"100%\" border=\"1\" cellspacing=\"0\" " +
                        "cellpadding=\"5\" style=\"border:1px solid black; border-collapse:collapse\">");
            body.Append("<tr style=\"background-color:white\">");
            body.Append("<th>Category</th><th>Item</th><th>Description</th><th>Quantity</th>");
            body.Append("</tr>");

            foreach(var entry in _pickup.ItemRequests)
            {
                body.AppendFormat("<tr><td>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td></tr>", 
                                  entry.Item.Category.Name, entry.Item.Name, entry.Item.Description,
                                  entry.Quantity);
            }

            body.Append("</table>");

            body.Append("<p>Problems? The contact information for the Director of Student Development can be found below.</p>");
            body.Append("<p>Jennifer Bird<br>Director of Student Development<br><a href=\"mailto:jbird2@uwsuper.edu\">jbird2@uwsuper.edu</a>");
            body.Append("<br><a href=\"tel:7153948571\">715-394-8571</a></p>");

            return body.ToString();
        }

        public override string GetMessageSubject()
        {
            return "UW-Superior Food Pantry - Your Request Has Been Received";
        }
    }
}
