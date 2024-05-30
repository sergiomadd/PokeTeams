using Microsoft.AspNetCore.Mvc;
using api.Models.DBPoketeamModels;
using Microsoft.AspNetCore.Components.Forms;
using api.Util;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using api.DTOs;
using System.Text.Json;
using api.Services;

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
        public async Task<ActionResult<string>> Post([FromBody] TeamUploadDTO team)
        {
            Printer.Log("User in team: ", User.Identity.Name);
            Team newTeam = await _teamService.SaveTeam(team, User.Identity.Name);
            if (newTeam == null)
            {
                object response = new
                {
                    content = $"Failed to upload team."
                };
                return BadRequest(response);
            }
            else
            {
                object response = new
                {
                    content = newTeam.Id
                };
                return Ok(response);
            }
        }

        [HttpPost, Route("delete")]
        public async Task<ActionResult<string>> Delete(TeamIdDTO data)
        {
            bool deleted = await _teamService.DeleteTeam(data.Id);
            if (!deleted)
            {
                return BadRequest($"Failed to delete team.");
            }
            return Ok($"Team successfully deleted.");
        }

        [HttpPost, Route("increment")]
        public async Task<ActionResult<string>> IncrementViewCount(TeamIdDTO data)
        {
            Printer.Log($"Incrementing {data.Id} team view count");
            string response = await _teamService.IncrementTeamViewCount(data.Id);
            Printer.Log(response);
            if (response.Equals("Team incremented"))
            {
                Printer.Log("returning ok");
                return Ok();
            }
            return BadRequest();
        }

        [HttpPost, Route("query")]
        public async Task<ActionResult<List<TeamPreviewDTO>>> QueryTeams(TeamSearchQueryDTO key)
        {
            List<TeamPreviewDTO> teams = await _teamService.QueryTeams(key);
            if (teams == null)
            {
                return NotFound("Couldn't find teams");
            }
            return Ok(teams);
        }
    }
}
