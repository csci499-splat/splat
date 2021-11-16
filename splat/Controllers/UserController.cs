using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using splat.Models;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace splat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "RequireAdministratorRole")]
    public class UserController : Controller
    {
        private readonly SplatContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly IConfiguration _configuration;

        public UserController(
            SplatContext context,
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            RoleManager<ApplicationRole> roleManager,
            IConfiguration configuration)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _configuration = configuration;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginModel login)
        {
            var result = await _signInManager.PasswordSignInAsync(login.UserName, login.Password, isPersistent: true, lockoutOnFailure: true);
            if(result.Succeeded)
            {
                var user = await _userManager.FindByNameAsync(login.UserName);
                // return success and token
                var claims = new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, login.UserName),
                    new Claim(JwtRegisteredClaimNames.Email, user.Email),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                };

                var token = new JwtSecurityToken
                    (
                        claims: claims,
                        expires: DateTime.UtcNow.AddDays(60),
                        notBefore: DateTime.UtcNow,
                        // TODO: Change to use Key from config file
                        signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes("bigdbbdjffhbfhjs;ash74587w3uobkdfbkfd")),
                            SecurityAlgorithms.HmacSha256)
                    );

                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    user = new
                    {
                        name = user.Name,
                        email = user.UserName,
                        role = _userManager.GetRolesAsync(user).Result[0]
                    }
                });
            } 
            else if(result.IsLockedOut)
            {
                // return locked out message
                return Unauthorized(new { message = "Locked out. Contact your administrator" });
            } 
            else
            {
                // return generic login failure
                return BadRequest(new { message = "Username or password is incorrect" });
            }
        }

        [HttpPost("logout")]
        [AllowAnonymous]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();

            return Ok(new { message = "Signed out successfully" });
        }
        
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterModel newUser)
        {
            ApplicationUser user = new ApplicationUser 
            { 
                UserName = newUser.UserName,
                Email = newUser.Email 
            };

            var result = await _userManager.CreateAsync(user, newUser.Password);

            result = await _userManager.AddToRoleAsync(user, newUser.Role);

            if(result.Succeeded)
            {
                return CreatedAtAction("RegisterUser", new { id = user.Id }, user);
            }

            return UnprocessableEntity();
        }
    }
}
