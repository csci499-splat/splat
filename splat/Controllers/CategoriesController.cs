using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
    public class CategoriesController : ControllerBase
    {
        private readonly SplatContext _context;

        public CategoriesController(SplatContext context)
        {
            _context = context;
        }

        // GET: api/Categories
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            return await _context.Categories.Where(c => c.Visible).ToListAsync();
        }

        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<Category>>> GetAllCategories()
        {
            return await _context.Categories.ToListAsync();
        }

        // GET: api/Categories/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(Guid id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            return category;
        }

        // PUT: api/Examples/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategory(Guid id, Category category)
        {
            if (id != category.Id)
            {
                return BadRequest();
            }

            _context.Entry(category).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoryExists(id))
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
        public async Task<ActionResult<Category>> PostCategory(Category category)
        {
            try
            {
                _context.Categories.Add(category);
                await _context.SaveChangesAsync();
            } 
            catch
            {
                return BadRequest(new { message = "Unable to add category (maybe the name already exists?)" });
            }

            return CreatedAtAction("GetCategory", new { id = category.Id }, category);
        }

        // POST: api/Categories/upload
        [HttpPost("upload")]
        public async Task<ActionResult<IEnumerable<Category>>> PostItemUpload(List<IFormFile> files)
        {
            if (files.Count == 0)
                return BadRequest(new { message = "File not found" });

            var file = files[0];

            IEnumerable<Category> records;

            try
            {
                records = CsvFileParser.ParseCsvFile<Category, CategoryMap>(file);
            }
            catch
            {
                return BadRequest(new { message = "Unable to parse records (try checking the headers)" });
            }

            var addedRecords = new List<Category>();

            foreach (var record in records)
            {
                // If item hasn't already been added to the DB
                if (await _context.Categories.FindAsync(record.Id) == null)
                {
                    addedRecords.Add(record);
                    _context.Categories.Add(record);
                }
            }

            await _context.SaveChangesAsync();

            return addedRecords;
        }

        // DELETE: api/Examples/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(Guid id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CategoryExists(Guid id)
        {
            return _context.Categories.Any(e => e.Id == id);
        }
    }
}
