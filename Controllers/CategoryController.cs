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
    public class CategoryController : ControllerBase
    {
        private readonly SplatContext _context;

        public CategoryController(SplatContext context) { _context = context; }

        // GET: api/Categories
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Example>>> GetCategories() { }

        // GET: api/Categories
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCategory(Guid id) { }

        // POST: api/Categories
        [HttpPost]     
        public async Task<IActionResult> CreateCategory(Category category) { }

        // PUT: api/Categories/id
        [HttpPut("{id}"]
        public async Task<IActionResult> UpdateCategory(Guid id, Category category) { }

        // DELETE: api/Categories/id
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(Guid id) { }
    }
}