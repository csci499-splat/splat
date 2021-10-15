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
        public DbSet<Category> Categories { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<Pickup> Pickups { get; set; }
        public DbSet<Donation> Donations { get; set; }
        public DbSet<CurrentHours> CurrentHours { get; set; }
        public DbSet<DayClosed> DayClosed { get; set; }
        public DbSet<StaffMessage> StaffMessages { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Category>()
                .Property(b => b.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP(0)");
            builder.Entity<Category>()
                .Property(b => b.Visible)
                .HasDefaultValue(true);

            builder.Entity<Item>()
                .Property(b => b.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP(0)");
            builder.Entity<Item>()
                .Property(b => b.Visible)
                .HasDefaultValue(true);

            builder.Entity<Donation>()
                .Property(b => b.DonatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP(0)");

            builder.Entity<Pickup>()
                .Property(b => b.SubmittedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP(0)");

            builder.Entity<CurrentHours>()
                .Property(b => b.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP(0)");

            builder.Entity<StaffMessage>()
                .Property(b => b.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP(0)");
        }
    }
}
