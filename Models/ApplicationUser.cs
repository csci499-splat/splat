using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace splat.Models
{
    public class ApplicationUser : IdentityUser<Guid>
    {
        [PersonalData]
        public string Name { get; set; }
    }
}
