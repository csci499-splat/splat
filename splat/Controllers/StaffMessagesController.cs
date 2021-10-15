using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using splat.Models;

namespace splat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaffMessagesController : ControllerBase
    {
        private readonly SplatContext _context;

        public StaffMessagesController(SplatContext context)
        {
            _context = context;
        }

        // GET: api/StaffMessages
        // Retrieve the latest staff message
        [HttpGet]
        public async Task<ActionResult<StaffMessage>> GetStaffMessages()
        {
            return await _context.StaffMessages.OrderBy(c => c.CreatedAt).LastOrDefaultAsync();
        }

        // POST: api/StaffMessages
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<StaffMessage>> PostStaffMessage(StaffMessage staffMessage)
        {
            _context.StaffMessages.Add(staffMessage);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetStaffMessage", new { id = staffMessage.CreatedAt }, staffMessage);
        }

        private bool StaffMessageExists(DateTime id)
        {
            return _context.StaffMessages.Any(e => e.CreatedAt == id);
        }
    }
}
