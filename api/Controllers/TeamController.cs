using api.Models;
using api.Services.TeamService;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeamController : ControllerBase
    {
        private readonly ITeamService _teamService;
        public TeamController(ITeamService teamService)
        {
            _teamService = teamService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TeamData>> Get(string id)
        {
            var team = await _teamService.GetTeam(id);
            if (team == null)
            {
                return BadRequest("Team not found.");
            }
            return Ok(team);
        }
        
        [HttpPost]
        public async Task<ActionResult<string>> Post([FromBody] TeamData team)
        {
            var id = await _teamService.Post(team);
            if (id == null)
            {
                return BadRequest($"Failed to upload {team}.");
            }
            object response = new
            {
                content = id
            };

            return Ok(response);
        }
    }
}
