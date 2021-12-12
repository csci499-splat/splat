using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace splat.Services.Emails
{
    interface IEmail
    {
        /// <summary>
        /// Provides a message body for the email
        /// </summary>
        /// <returns>message body</returns>
        public string GetMessageBody();

        /// <summary>
        /// Provides a message subject for the email
        /// </summary>
        /// <returns>message subject</returns>
        public string GetMessageSubject();

        public Task SendMailAsync(string subject, string body);
    }
}
