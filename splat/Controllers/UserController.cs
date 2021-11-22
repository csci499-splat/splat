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
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using splat.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace splat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "Default", AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
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
            var loginUser = new ApplicationUser
            {
                UserName = login.UserName
            };
            
            var user = await _userManager.FindByNameAsync(loginUser.UserName);

            if (user == null)
            {
                // attempt to register
                var ldapCheckSucceeded = await _userManager.CheckPasswordAsync(loginUser, login.Password);
                
                if (!ldapCheckSucceeded)
                {
                    return Unauthorized(new { message = "Username or password is incorrect" });
                }

                var registerSucceeded = await Register(loginUser);

                if (!registerSucceeded)
                    return StatusCode(500);

                user = await _userManager.FindByNameAsync(loginUser.UserName);
            }
            else
            {
                // attempt to sign in a user
                var result = await _signInManager.PasswordSignInAsync(login.UserName, login.Password, true, false);

                if (!result.Succeeded)
                {
                    // return generic login failure
                    return Unauthorized(new { message = "Username or password is incorrect" });
                }
            }

            IdentityOptions _options = new();

            var roles = await _userManager.GetRolesAsync(user);
            // return success and token
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, login.UserName),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(_options.ClaimsIdentity.UserNameClaimType, user.UserName),
                new Claim("username", user.UserName),
            };

            var claimsIdentity = new ClaimsIdentity(claims, "Token");

            claimsIdentity.AddClaims(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var token = new JwtSecurityToken
            (
                claims: claimsIdentity.Claims,
                expires: DateTime.UtcNow.AddDays(7),
                notBefore: DateTime.UtcNow,
                signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Token:Key"])),
                    SecurityAlgorithms.HmacSha256)
            );

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                user = new
                {
                    name = user.Name ?? user.Email,
                    email = user.UserName,
                    role = roles.Count == 0 ? "" : roles[0]
                }
            });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();

            return Ok(new { message = "Signed out successfully" });
        }

        private async Task<string> GetLdapNameAsync(ApplicationUser user)
        {
            var name = await Task.Run(() =>
            {
                using var auth = new LDAPAuthentication(_configuration.GetSection("LdapAuth").Get<LDAPAuthenticationOptions>());
                return auth.GetName(user.UserName);
            });

            return name;
        }

        private async Task<bool> Register(ApplicationUser newUser)
        {
            if (newUser == null) return false;

            newUser.Email = newUser.UserName;
            newUser.Name = await GetLdapNameAsync(newUser);

            var result = await _userManager.CreateAsync(newUser);
            await _userManager.AddToRoleAsync(newUser, "Student");

            var roles = await _userManager.GetRolesAsync(newUser);

            return result.Succeeded;
        }

        
        [HttpGet]
        [Authorize(Policy = "RequireAdministratorRole", AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<IEnumerable<ApplicationUserDTO>>> GetAllUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            var usersDTO = new List<ApplicationUserDTO>();

            foreach(var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);

                usersDTO.Add(new ApplicationUserDTO
                {
                    Name = user.Name,
                    Email = user.Email,
                    Role = roles[0]
                });
            }

            return usersDTO;
        }

        [HttpPost("role")]
        [Authorize(Policy = "RequireAdministratorRole", AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> ChangeRole([FromBody] ApplicationUserChangeRoleDTO roleChange)
        {
            var user = await _userManager.FindByNameAsync(roleChange.UserName);

            if(user == null)
            {
                return NotFound(new { message = "User does not exist" });
            }

            var currentRoles = await _userManager.GetRolesAsync(user);

            await _userManager.RemoveFromRoleAsync(user, currentRoles[0]);

            var roleExists = await _roleManager.RoleExistsAsync(roleChange.NewRole);

            if(!roleExists)
            {
                return NotFound(new { message = "Role does not exist" });
            }

            await _userManager.AddToRoleAsync(user, roleChange.NewRole);

            return Ok(new { message = "Role changed successfully" });
        }
    }
}
