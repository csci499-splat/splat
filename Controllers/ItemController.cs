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
    public class ItemController : ControllerBase
    {
        private readonly SplatContext _context;

        public CItemController(SplatContext context) { _context = context; }

        [HttpPut("{id}")]
        public async Task<IActionResult> CreateItem(Guid id, Item item) { }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateItem(Guid id, Item item) { }

        [HttpGet]
        [Authorize(Policy = "RequireAdministratorRole")]
        public async Task<IActionResult> ListItems() { }

        [HttpGet("{id}")]
        [Authorize(Policy = "RequireAdministratorRole")]
        public async Task<IActionResult> ListItem(int id) { }

        [HttpDelete("{id}")]
        [Authorize(Policy = "RequireAdministratorRole")]
        public async Task<IActionResult> DeleteItem(int id) { }
    }
}