using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace splat.Models
{
    public class SplatContext : IdentityDbContext<ApplicationUser, ApplicationRole, Guid>
    {
        public SplatContext(DbContextOptions<SplatContext> options)
            : base(options)
        { 
        }

        public DbSet<Example> Examples { get; set; }
    }
}
