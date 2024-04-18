using api.Models.DBPoketeamModels;
using api.Models.DTOs;
using api.Services.TeamService;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TagController : ControllerBase
    {
        private readonly IPokeTeamService _teamService;

        public TagController(IPokeTeamService teamService)
        {
            _teamService = teamService;
        }

        [HttpGet("{identifier}")]
        public async Task<ActionResult<Tag>> Get(string identifier)
        {
            Tag tag = await _teamService.GetTag(identifier);
            if (tag == null)
            {
                return BadRequest("Tag not found.");
            }
            return Ok(tag);
        }

        [HttpPost]
        public async Task<ActionResult<Tag>> Post(Tag tag)
        {
            bool saved = await _teamService.SaveTag(tag);
            if (!saved)
            {
                return BadRequest("Tag not saved.");
            }
            return Ok();
        }
    }
}
