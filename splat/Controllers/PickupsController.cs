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

            if(user != null)
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

        private bool PickupExists(Guid id)
        {
            return _context.Pickups.Any(p => p.Id == id);
        }

        private static void UpdateStatus(PickupStatus status, Pickup pickup)
        {
            pickup.PickupStatus = status;
        }

    }
}
