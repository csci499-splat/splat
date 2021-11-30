using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using splat.Models;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.JsonPatch.Operations;
using Microsoft.AspNetCore.Mvc.NewtonsoftJson;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace splat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "Default", AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class PickupsController : ControllerBase
    {
        private readonly SplatContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public PickupsController(SplatContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/Pickups
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pickup>>> GetUserPickups()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;

            if(identity != null)
            {
                var username = identity.FindFirst("username").Value;

                var user = await _userManager.FindByNameAsync(username);

                if (user != null)
                {
                    var pickups = await _context.Pickups.Where(p => p.ApplicationUserEmail == user.Email).ToListAsync();
                    return pickups;
                }
            }

            return Unauthorized(new { message = "Invalid request. Try signing out and back in" });
        }

        // GET: api/Pickups/all
        [HttpGet("all")]
        [Authorize(Policy = "ElevatedRights", AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<IEnumerable<Pickup>>> GetAllPickups()
        {
            return await _context.Pickups.ToListAsync();
        }

        // GET: api/Pickups/id
        [HttpGet("{id}")]
        [Authorize(Policy = "ElevatedRights", AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<Pickup>> GetPickups(Guid id)
        {
            var pickup = await _context.Pickups.FindAsync(id);

            if (pickup == null)
            {
                return NotFound();
            }

            return pickup;
        }

        // GET: api/Pickups/active
        [HttpGet("active")]
        [Authorize(Policy = "ElevatedRights", AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<IEnumerable<Pickup>>> GetActivePickups()
        {
            return await _context.Pickups
                .Where(p => p.PickupStatus == PickupStatus.WAITING || p.PickupStatus == PickupStatus.PENDING)
                .ToListAsync();
        }

        // GET: api/Pickups/history?dateFrom=<date>&dateTo=<date>
        [HttpGet("history")]
        [Authorize(Policy = "ElevatedRights", AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<IEnumerable<Pickup>>> GetHistoryPickups([FromQuery] DateRange dates)
        {
            return await _context.Pickups
                .Where(p => p.PickupStatus == PickupStatus.DISBURSED || p.PickupStatus == PickupStatus.CANCELED)
                .Where(p => p.SubmittedAt >= dates.DateFrom && p.SubmittedAt <= dates.DateTo)
                .ToListAsync();
        }

        // POST: api/Pickups
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Pickup>> PostPickup(Pickup pickup)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;

            if (identity != null)
            {
                var username = identity.FindFirst("username").Value;

                var user = await _userManager.FindByNameAsync(username);

                if (user != null)
                {
                    pickup.ApplicationUserEmail = user.Email;
                    _context.Pickups.Add(pickup);
                    await _context.SaveChangesAsync();

                    return CreatedAtAction("GetPickup", new { id = pickup.Id }, pickup);
                }
            }

            return Unauthorized(new { message = "Invalid request" });
        }

        // PATCH: api/Pickups/{id}
        [HttpPatch("{id}")]
        [Authorize(Policy = "ElevatedRights", AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult> UpdatePatch(Guid id, [FromBody] JsonPatchDocument<Pickup> patch)
        {
            var pickup = await _context.Pickups.FindAsync(id);
            var prevStatus = pickup.PickupStatus;

            if (pickup == null)
            {
                return NotFound();
            }

            patch.ApplyTo(pickup, ModelState);

            if (!ModelState.IsValid || !ValidatePickupPatch(pickup, prevStatus))
                return BadRequest(new { message = "Invalid update request" });

            await _context.SaveChangesAsync();

            return Ok(pickup);
        }

        private static bool ValidatePickupPatch(Pickup pickup, PickupStatus prevStatus)
        {
            try
            {
                if(prevStatus != pickup.PickupStatus)
                    TestUpdateStatus(prevStatus, pickup.PickupStatus);
            }
            catch (Exception)
            {
                return false;
            }

            return true;
        }

        private bool PickupExists(Guid id)
        {
            return _context.Pickups.Any(p => p.Id == id);
        }


        public static bool TestUpdateStatus(PickupStatus prevStatus, PickupStatus nextStatus)
        {
            switch (nextStatus)
            {
                case PickupStatus.PENDING:
                    throw new Exception("Can't change to PENDING");

                case PickupStatus.WAITING:
                    if(prevStatus != PickupStatus.PENDING)
                    {
                        throw new Exception("Cannot set pickup status to Waiting");
                    }
                    break;

                case PickupStatus.DISBURSED:
                    if(prevStatus != PickupStatus.WAITING)
                    {
                        throw new Exception("Cannot set pickup status to Disbursed");
                    }
                    
                    break;

                case PickupStatus.CANCELED:
                    if(prevStatus != PickupStatus.PENDING && prevStatus != PickupStatus.WAITING)
                    {
                        throw new Exception("Cannot set pickup status to Cancel");
                    }
                    
                    break;

                default:
                    throw new Exception("Invalid pickup status.");
            }

            return true;

        }

    }
}
