using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggyController : BaseApiController
    {
        private readonly DataContext _context;
        public BuggyController(DataContext context)
        {
            _context = context;
        }

        [HttpGet("auth")]
        public ActionResult<string> GetSecret()
        {
            return Unauthorized("not autroised");
        }
        [HttpGet("NotFound")]
        public ActionResult<AppUser> GetNotFound()
        {
            var data = _context.Users.Find(-1);
            if(data == null){
                return NotFound("not found");
            }
            else{
                return Ok(data);
            }
           
        }

        [HttpGet("ServerError")]
        public ActionResult<string> GetServerError()
        {
            var data = _context.Users.Find(-1);
            var datatoreturn = data.ToString();
            return datatoreturn;
           
        }

        [HttpGet("BadRequest")]
        public ActionResult<string> GetBadRequest()
        {
             return BadRequest("bad Request!");
        }
    }
}