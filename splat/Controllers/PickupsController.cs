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
using Microsoft.AspNetCore.Mvc.NewtonsoftJson;

namespace splat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    //[Authorize(Policy = "ElevatedRights")]
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
        [Authorize]
        public async Task<ActionResult<IEnumerable<Pickup>>> GetUserPickups()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);

            if (user != null)
            {
                var pickups = await _context.Pickups.Where(p => p.ApplicationUserEmail == user.Email).ToListAsync();
                return pickups;
            }

            return NotFound(new { message = "Invalid user" });
        }

        // GET: api/Pickups/all
        [HttpGet("all")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Pickup>>> GetAllPickups()
        {
            return await _context.Pickups.ToListAsync();
        }

        // GET: api/Pickups/id
        [HttpGet("{id}")]
        [AllowAnonymous]
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
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Pickup>>> GetActivePickups()
        {
            return await _context.Pickups
                .Where(p => p.PickupStatus == PickupStatus.WAITING || p.PickupStatus == PickupStatus.PENDING)
                .ToListAsync();
        }

        // POST: api/Pickups
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Pickup>> PostPickup(Pickup pickup)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);

            if (user != null)
            {
                pickup.ApplicationUserEmail = user.Email;
                _context.Pickups.Add(pickup);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetPickup", new { id = pickup.Id }, pickup);
            }

            return NotFound(new { message = "Invalid user" });

        }


        [HttpPatch("{id}")]
        public async Task<ActionResult> UpdatePatch(Guid id, [FromBody] JsonPatchDocument<Pickup> patch)

        {
            var pickup = await _context.Pickups.FindAsync(id);

            if (pickup == null)
            {
                return NotFound();
            }

            patch.ApplyTo(pickup, ModelState);
            await _context.SaveChangesAsync();

            return Ok(pickup);
        }

        [HttpPatch("{id}/status")]
        public async Task<ActionResult> UpdatePickupStatus(Guid id, PickupStatus status)

        {
            var pickup = await _context.Pickups.FindAsync(id);

            if (pickup == null)
            {
                return NotFound();
            }

            try
            {
                UpdateStatus(status, pickup);
                _context.Pickups.Update(pickup);
                await _context.SaveChangesAsync();
            }
            catch
            {
                throw new Exception("Invalid Input");
            }
            
            return Ok(pickup);
        }

        private bool PickupExists(Guid id)
        {
            return _context.Pickups.Any(p => p.Id == id);
        }


        public static void UpdateStatus(PickupStatus status, Pickup pickup)
        {
            

            switch (status)
            {
                case PickupStatus.PENDING:
                    throw new Exception("Can't change to PENDING");

                case PickupStatus.WAITING:
                    if(pickup.PickupStatus != PickupStatus.PENDING)
                    {
                        throw new Exception("Cannot set pickup status to Waiting");
                    }
                    break;

                case PickupStatus.DISBURSED:
                    if(pickup.PickupStatus != PickupStatus.WAITING)
                    {
                        throw new Exception("Cannot set pickup status to Disbursed");
                    }
                    
                    break;

                case PickupStatus.CANCELED:
                    if(pickup.PickupStatus != PickupStatus.PENDING && pickup.PickupStatus != PickupStatus.WAITING)
                    {
                        throw new Exception("Cannot set pickup status to Cancel");
                    }
                    
                    break;

                default:
                    throw new Exception("Invalid pickup status.");
            }

            pickup.PickupStatus = status;

        }





    }
}
