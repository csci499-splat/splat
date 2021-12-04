using splat.Models;
using splat.Services.Emails;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace splat.Services.Emails
{
    public abstract class EmailBase
    {
        private readonly EmailExchangeOptions _emailExchangeOptions;
        private SmtpClient _client;

        protected MailMessage message;

        public EmailBase(Pickup pickup, EmailExchangeOptions options)
        {
            _emailExchangeOptions = options;

            message = new MailMessage(options.Sender, pickup.ApplicationUserEmail);
            message.IsBodyHtml = true;

            _client = new SmtpClient(options.SMTPServerHost);
            _client.Port = options.SMTPPort;
            _client.UseDefaultCredentials = false;
            _client.EnableSsl = true;
            _client.Credentials = new NetworkCredential(options.SMTPServerUser, options.SMTPServerPassword);
        }

        /// <summary>
        /// Provides an HTML message body based on the pickup and email type
        /// </summary>
        /// <returns>HTML message body</returns>
        public abstract string CreateMessageBody();

        /// <summary>
        /// Populate the message with the relevant subject and HTML body then send the email
        /// </summary>
        /// <returns></returns>
        public void SendMail(string subject, string body)
        {
            message.Subject = subject;
            message.Body = body;

            _client.Send(message);
        }
    }
}
