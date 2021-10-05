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

        public async Task<IActionResult> GetCategories() { }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategory(int id) { }

        [HttpPost]     
        public async Task<IActionResult> CreateCategory(Guid id, Category category) { }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(Guid id, Category category) { }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id) { }
    }
}