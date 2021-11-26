using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.AspNetCore.Diagnostics.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Extensions.Options;
using System.Linq;
using splat.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;
using splat.Services;

namespace splat
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            services.AddDbContext<SplatContext>(options =>
                options.UseNpgsql(Configuration["DbContext:ConnectionString"]));

            services.AddDatabaseDeveloperPageExceptionFilter();

            if (Configuration["Mode"] == "Normal")
            {
                Console.WriteLine("Using LDAP for authentication");

                services.Configure<LDAPAuthenticationOptions>(Configuration.GetSection("LdapAuth"));

                services.AddIdentity<ApplicationUser, ApplicationRole>(options => options.SignIn.RequireConfirmedAccount = false)
                .AddUserManager<SplatUserManager<ApplicationUser>>()
                .AddRoles<ApplicationRole>()
                .AddEntityFrameworkStores<SplatContext>()
                .AddDefaultTokenProviders();
            } 
            else if(Configuration["Mode"] == "BypassLDAP")
            {
                Console.WriteLine("Bypassing LDAP for authentication!");

                services.AddIdentity<ApplicationUser, ApplicationRole>(options => options.SignIn.RequireConfirmedAccount = false)
                .AddRoles<ApplicationRole>()
                .AddEntityFrameworkStores<SplatContext>()
                .AddDefaultTokenProviders();
            }

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddIdentityServerJwt()
            .AddJwtBearer(jwtBearerOptions =>
            {
                jwtBearerOptions.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateActor = false,
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes
                                                        (Configuration["Token:Key"]))
                };
                jwtBearerOptions.SaveToken = true;
            });

            services.AddAuthorization(options =>
            {
                options.AddPolicy("RequireAdministratorRole",
                    policy => policy.RequireRole("Administrator"));
                options.AddPolicy("ElevatedRights",
                    policy => policy.RequireRole("Administrator", "Staff"));
            });

            services.AddControllers()
                    .AddNewtonsoftJson();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IServiceProvider services)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseMigrationsEndPoint();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            using (var scope =
                app.ApplicationServices.CreateScope())
            using (var context = scope.ServiceProvider.GetService<SplatContext>())
                context.Database.Migrate();

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseAuthentication();
            app.UseRouting();
            app.UseAuthorization();

            AddRoles(services).Wait();
            AddDefaultUsers(services).Wait();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }

        private async Task AddRoles(IServiceProvider serviceProvider)
        {
            var _roleManager = serviceProvider.GetRequiredService<RoleManager<ApplicationRole>>();

            var roles = Configuration.GetSection("Accounts:Roles").Get<string[]>();

            IdentityResult roleResult;

            foreach (var role in roles)
            {
                var exists = await _roleManager.RoleExistsAsync(role);
                if (!exists)
                {
                    roleResult = await _roleManager.CreateAsync(new ApplicationRole(role));
                }
            }
        }

        class DefaultUser
        {
            public string Email { get; set; }
            public string Role { get; set; }
            public string Name { get; set; }
        }

        private async Task AddDefaultUsers(IServiceProvider serviceProvider)
        {
            var defaultUsers = Configuration.GetSection("Accounts:InitialUsers").Get<DefaultUser[]>();

            foreach(var defaultUser in defaultUsers)
            {
                var _userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

                var user = await _userManager.FindByNameAsync(defaultUser.Email);

                // user does not already exist
                if(user == null)
                {
                    var createdUser = new ApplicationUser
                    {
                        UserName = defaultUser.Email,
                        Email = defaultUser.Email,
                        Name = defaultUser.Name
                    };

                    var createdUserResult = await _userManager.CreateAsync(
                        createdUser,
                        Configuration["Accounts:DefaultPassword"]);

                    if (createdUserResult.Succeeded)
                        await _userManager.AddToRoleAsync(createdUser, defaultUser.Role);
                    else
                        Console.Error.WriteLine(createdUserResult.Errors);
                }
            
            }
        }
    }
}
