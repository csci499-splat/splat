using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using CsvHelper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using splat.Models;
using splat.Util.CSVFileUploads;

namespace splat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "ElevatedRights", AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ItemsController : ControllerBase
    {
        private readonly SplatContext _context;

        public ItemsController(SplatContext context)
        {
            _context = context;
        }

        // GET: api/Items?c={category}
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Item>>> GetItems([FromQuery] Guid c)
        {
            return await _context.Items.Where(b => b.CategoryId == c)
                .Include(b => b.Category)
                .Where(b => b.Category.Visible && b.Visible)
                .ToListAsync();
        }

        // GET: api/Items/all
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<Item>>> GetAllItems()
        {
            return await _context.Items.Include(b => b.Category)
                .ToListAsync();
        }

        // GET: api/Items/Id
        [HttpGet("{id}")]
        public async Task<ActionResult<Item>> GetItem(Guid id)
        {
            // var item = await _context.Items.FindAsync(id);

            var item = await _context.Items.Include(c => c.Category).
                        FirstOrDefaultAsync(i => i.Id.Equals(id));

            if (item == null)
            {
                return NotFound();
            }

            return item;
        }

        // PUT: api/Items/id
        [HttpPut("{id}")]
        public async Task<IActionResult> PutItem(Guid id, Item item)
        {
            if (id != item.Id)
            {
                return BadRequest();
            }

            _context.Entry(item).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ItemExists(id))
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

        // POST: api/Items
        [HttpPost]
        public async Task<ActionResult<Item>> PostItem(Item item)
        {
            _context.Items.Add(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetItem", new { id = item.Id }, item);
        }

        // POST: api/Items/upload
        [HttpPost("upload")]
        public async Task<ActionResult<IEnumerable<Item>>> PostItemUpload(List<IFormFile> files)
        {
            if (files.Count == 0)
                return BadRequest(new { message = "File not found" });

            var file = files[0];

            IEnumerable<Item> records;

            try
            {
                records = CsvFileParser.ParseCsvFile<Item, ItemMap>(file);
            } 
            catch
            {
                return BadRequest(new { message = "Unable to parse records (try checking the headers)" });
            }
            
            var addedRecords = new List<Item>();

            foreach(var record in records)
            {
                // If item hasn't already been added to the DB
                if(await _context.Items.FindAsync(record.Id) == null &&
                    await _context.Categories.FindAsync(record.CategoryId) != null)
                {
                    addedRecords.Add(record);
                    _context.Items.Add(record);
                }
            }

            await _context.SaveChangesAsync();

            return addedRecords;
        }

        // DELETE: api/Items/id
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(Guid id)
        {
            var item = await _context.Items.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            _context.Items.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ItemExists(Guid id)
        {
            return _context.Items.Any(e => e.Id == id);
        }
    }
}
