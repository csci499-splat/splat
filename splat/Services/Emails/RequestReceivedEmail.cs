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

            return body.ToString();
        }
    }
}
