using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace splat.Models
{
    public class SplatContext : DbContext
    {
        public SplatContext(DbContextOptions<SplatContext> options) : base(options) { }

        public DbSet<Example> Examples { get; set; }
    }
}
