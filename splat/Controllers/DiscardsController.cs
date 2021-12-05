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
    public class DiscardsController : ControllerBase
    {
        private readonly SplatContext _context;

        public DiscardsController(SplatContext context)
        {
            _context = context;
        }

        // GET: api/Discards
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Discard>>> GetDiscards()
        {
            return await _context.Discards.ToListAsync();
        }

        // GET: api/Discards/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Discard>> GetDiscard(Guid id)
        {
            var discard = await _context.Discards.FindAsync(id);

            if (discard == null)
            {
                return NotFound();
            }

            return discard;
        }

        // POST: api/Discards
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Discard>> PostDiscard(Discard discard)
        {
            _context.Discards.Add(discard);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDiscard", new { id = discard.Id }, discard);
        }

        // DELETE: api/Discards/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDiscard(Guid id)
        {
            var discard = await _context.Discards.FindAsync(id);
            if (discard == null)
            {
                return NotFound();
            }

            _context.Discards.Remove(discard);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DiscardExists(Guid id)
        {
            return _context.Discards.Any(e => e.Id == id);
        }
    }
}
