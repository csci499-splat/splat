using splat.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace splat.Services.Emails
{
    public class EmailFactory
    {
        public static EmailBase Create(EmailTypes type, Pickup pickup, EmailExchangeOptions options)
        {
            return GetEmail(type, pickup, options);
        }

        private static EmailBase GetEmail(EmailTypes type, Pickup pickup, EmailExchangeOptions options)
            => type switch
            {
                EmailTypes.RequestSent => new RequestReceivedEmail(pickup, options),
                EmailTypes.PickupReady => new PickupReadyEmail(pickup, options),
                EmailTypes.PickupDisbursed => new PickupDisbursedEmail(pickup, options),
                _ => throw new ArgumentException("The given email type is not valid", "type")
            };
    }
}
