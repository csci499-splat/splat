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

            services.AddControllersWithViews(options =>
            {
                options.InputFormatters.Insert(0, GetJsonPathInputFormatter());
            });

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            services.AddDbContext<SplatContext>(options =>
                options.UseNpgsql(Configuration["DbContext:ConnectionString"]));

            services.AddDatabaseDeveloperPageExceptionFilter();

            services.AddIdentity<ApplicationUser, ApplicationRole>(options => options.SignIn.RequireConfirmedAccount = false)
                .AddRoles<ApplicationRole>()
                .AddEntityFrameworkStores<SplatContext>();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddIdentityServerJwt()
                .AddCookie()
                .AddJwtBearer(jwtBearerOptions =>
                {
                    jwtBearerOptions.TokenValidationParameters = new TokenValidationParameters()
                    {
                        ValidateActor = false,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = Configuration["Token:Issuer"],
                        ValidAudience = Configuration["Token:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes
                                                           (Configuration["Key"]))
                    };
                });

            services.AddAuthorization(options =>
            {
                options.AddPolicy("RequireAdministratorRole",
                    policy => policy.RequireRole("Administrator"));
                options.AddPolicy("ElevatedRights",
                    policy => policy.RequireRole("Administrator", "Staff"));
            });

            services.Configure<IdentityOptions>(options =>
            {
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequireUppercase = true;
                options.Password.RequiredLength = 8;
                options.Password.RequiredUniqueChars = 3;

                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.AllowedForNewUsers = false;

                options.User.AllowedUserNameCharacters =
                "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_";
            });

            services.ConfigureApplicationCookie(options =>
            {
                options.Cookie.HttpOnly = true;
                options.ExpireTimeSpan = TimeSpan.FromHours(8);

                options.LoginPath = "/Identity/Account/Login";
                options.AccessDeniedPath = "/Identity/Account/AccessDenied";
                options.SlidingExpiration = true;
            });

            services.Configure<JwtBearerOptions>(
                IdentityServerJwtConstants.IdentityServerJwtBearerScheme,
                options =>
                {
                    var onTokenValidated = options.Events.OnTokenValidated;

                    options.Events.OnTokenValidated = async context =>
                    {
                        await onTokenValidated(context);
                        // add custom logic below if wanted
                    };
                });

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

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            AddRoles(services).Wait();

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

        private static NewtonsoftJsonPatchInputFormatter GetJsonPathInputFormatter()
        {
            var builder = new ServiceCollection()
               .AddLogging()
               .AddMvc()
               .AddNewtonsoftJson()
               .Services.BuildServiceProvider();

            return builder
                .GetRequiredService<IOptions<MvcOptions>>()
                .Value
                .InputFormatters
                .OfType<NewtonsoftJsonPatchInputFormatter>()
                .First();
        }

        private async Task AddRoles(IServiceProvider serviceProvider)
        {
            var _roleManager = serviceProvider.GetRequiredService<RoleManager<ApplicationRole>>();
            var _userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var roles = new string[] { "Administrator", "Staff", "Student"};
            IdentityResult roleResult;

            foreach(var role in roles)
            {
                var exists = await _roleManager.RoleExistsAsync(role);
                if(!exists)
                {
                    roleResult = await _roleManager.CreateAsync(new ApplicationRole(role));
                }
            }

            // TODO: grab these from configuation file
            // TODO: place into separate method
            var adminUser = new ApplicationUser
            {
                Name = "admin",
                UserName = "admin",
                Email = "admin@gmail.com"
            };

            string userPass = "testPass123%";

            var user = await _userManager.FindByNameAsync(adminUser.UserName);
            if(user != null)
            {
                await _userManager.DeleteAsync(user);
                user = null;
            }

            if(user == null)
            {
                Console.WriteLine("Creating user " + adminUser);

                var createUser = await _userManager.CreateAsync(adminUser, userPass);
                if(createUser.Succeeded)
                {
                    Console.WriteLine("success");
                    await _userManager.AddToRoleAsync(adminUser, "Administrator");
                } else
                {
                    Console.WriteLine(createUser.Errors);
                }
            }
        }
    }
}
