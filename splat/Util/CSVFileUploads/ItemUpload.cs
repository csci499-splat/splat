using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using splat.Models;

namespace splat.Util.CSVFileUploads
{
    [Route("api/item/upload")]
    [Authorize(Policy = "ElevatedRights", AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ItemUpload
    {
        private readonly SplatContext _context;

        public ItemUpload(SplatContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<bool>> GetRecords([FromBody] )
        {
            return new ActionResult<bool>(true);
        }
    }
}
