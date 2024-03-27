using api.Models.DTOs;
using api.Services.TeamService;
using Microsoft.AspNetCore.Mvc;
using api.Models.DBPoketeamModels;
using Microsoft.AspNetCore.Components.Forms;
using api.Util;
using Microsoft.AspNetCore.RateLimiting;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeamController : ControllerBase
    {
        private readonly IPokeTeamService _teamService;

        public TeamController(IPokeTeamService teamService)
        {
            _teamService = teamService;
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<TeamDTO>> Get(string id)
        {
            var team = await _teamService.GetTeam(id);
            if (team == null)
            {
                return BadRequest("Team not found.");
            }
            return Ok(team);
        }
        
        [HttpPost]
        public async Task<ActionResult<string>> Post([FromBody] TeamDTO team)
        {
            Team newTeam = await _teamService.SaveTeam(team);
            if (newTeam == null)
            {
                return BadRequest($"Failed to upload team.");
            }
            object response = new
            {
                content = newTeam.Id
            };
            return Ok(response);
        }
        [EnableRateLimiting("fixed")]
        [HttpPost, Route("increment")]
        public async Task<ActionResult<string>> IncrementViewCount(TeamIdDTO data)
        {
            Printer.Log($"Incrementing {data.Id} team view count");
            string response = await _teamService.IncrementTeamViewCount(data.Id);
            if (response.Equals("Team incremented"))
            {
                return Ok(response);
            }
            return BadRequest(response);
        }
    }
}
