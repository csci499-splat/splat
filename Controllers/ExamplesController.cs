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
    public class ExamplesController : ControllerBase
    {
        private readonly SplatContext _context;

        public ExamplesController(SplatContext context)
        {
            _context = context;
        }

        // GET: api/Examples
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Example>>> GetExamples()
        {
            return await _context.Examples.ToListAsync();
        }

        // GET: api/Examples/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Example>> GetExample(int id)
        {
            var example = await _context.Examples.FindAsync(id);

            if (example == null)
            {
                return NotFound();
            }

            return example;
        }

        // PUT: api/Examples/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutExample(Guid id, Example example)
        {
            if (id != example.Id)
            {
                return BadRequest();
            }

            _context.Entry(example).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ExampleExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Examples
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Example>> PostExample(Example example)
        {
            _context.Examples.Add(example);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetExample", new { id = example.Id }, example);
        }

        // DELETE: api/Examples/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExample(int id)
        {
            var example = await _context.Examples.FindAsync(id);
            if (example == null)
            {
                return NotFound();
            }

            _context.Examples.Remove(example);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ExampleExists(Guid id)
        {
            return _context.Examples.Any(e => e.Id == id);
        }
    }
}
