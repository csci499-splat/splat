using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using splat.Models;

namespace splat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "ElevatedRights")]
    public class HoursController : ControllerBase
    {
        private readonly SplatContext _context;

        public HoursController(SplatContext context)
        {
            _context = context;
        }

        // GET: api/Hours
        // gets the most recent set of hours
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<CurrentHours>> GetHours()
        {
            return await _context.CurrentHours.OrderBy(b => b.CreatedAt).LastOrDefaultAsync();
        }

        // POST: api/Hours
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<CurrentHours>> PostHours(CurrentHours hours)
        {
            _context.CurrentHours.Add(hours);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetHours", new { createdAt = hours.CreatedAt }, hours);
        }

        // GET: api/Hours/Days
        [HttpGet("Days")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<DayClosed>>> GetDaysClosed()
        {
            return await _context.DayClosed.Where(b => b.ClosedOn >= DateTime.Today).OrderBy(p => p.ClosedOn).ToListAsync();
        }

        // POST: api/Hours/Days
        [HttpPost("Days")]
        public async Task<ActionResult<DayClosed>> PostDays(DayClosed day)
        {
            _context.DayClosed.Add(day);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDay", day);
        }

        // DELETE: api/Hours/Days/{dayTime}
        [HttpDelete("Days/{dayTime}")]
        public async Task<ActionResult> DeleteDays(DateTime dayTime)
        {
            var day = await _context.DayClosed.FindAsync(dayTime);
            if (day == null)
            {
                return NotFound();
            }

            _context.DayClosed.Remove(day);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool HoursExists(DateTime createdAt)
        {
            return _context.CurrentHours.Any(e => e.CreatedAt == createdAt);
        }
    }
}
