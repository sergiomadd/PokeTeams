using Microsoft.AspNetCore.Mvc;
using api.Models.DBPoketeamModels;
using Microsoft.AspNetCore.Components.Forms;
using api.Util;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using api.DTOs;
using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using api.DTOs.PokemonDTOs;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeamController : ControllerBase
    {
        private readonly ITeamService _teamService;
        private readonly IIdentityService _identityService;

        public TeamController(
            ITeamService teamService,
            IIdentityService identityService)
        {
            _teamService = teamService;
            _identityService = identityService;
        }


        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<TeamDTO>> GetTeamDTO(string id)
        {
            if (_identityService.CheckForRefresh(Request))
            {
                return Unauthorized("NoAccessTokenProvided");
            }
            else
            {
                int? langId = Converter.GetLangIDFromHttpContext(HttpContext);
                var team = await _teamService.GetTeam(id, langId ?? 9);
                if (team == null)
                {
                    return BadRequest("Team not found.");
                }
                return Ok(team);
            }
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [AllowAnonymous]
        [HttpGet("data/{id}")]
        public async Task<ActionResult<TeamDataDTO>> GetTeamData(string id)
        {
            if (_identityService.CheckForRefresh(Request))
            {
                return Unauthorized("NoAccessTokenProvided");
            }
            else
            {
                int? langId = Converter.GetLangIDFromHttpContext(HttpContext);
                var team = await _teamService.GetTeamData(id, langId ?? 9);
                if (team == null)
                {
                    return BadRequest("Team data not found.");
                }
                return Ok(team);
            }
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [AllowAnonymous]
        [HttpPost, Route("save")]
        public async Task<ActionResult> SaveTeam([FromBody] TeamDTO team)
        {
            if (_identityService.CheckForRefresh(Request))
            {
                return Unauthorized("NoAccessTokenProvided");
            }
            else
            {
                string? validation = _teamService.ValidateTeamDTO(team);
                if (validation != null)
                {
                    return BadRequest(validation);
                }
                Team? newTeam = await _teamService.SaveTeam(team);
                if (newTeam == null)
                {
                    return BadRequest("Error saving team");
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
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost, Route("update")]
        public async Task<ActionResult<string>> Update([FromBody] TeamDTO teamDTO)
        {
            Team? currentTeam = await _teamService.GetTeamModel(teamDTO.ID);
            if (currentTeam == null || currentTeam.Player == null)
            {
                return Unauthorized("Unauthorized");
            }
            User? loggedUser = await _identityService.GetLoggedUser();
            if (loggedUser.Id == null || loggedUser.Id != currentTeam.Player.Id)
            {
                return Unauthorized("Unauthorized");
            }
            Team? newTeam = await _teamService.UpdateTeam(teamDTO, teamDTO.ID);
            if (newTeam == null)
            {
                return BadRequest("Could not update team");
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

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost, Route("delete")]
        public async Task<ActionResult<string>> Delete(TeamIdDTO data)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized("Unauthorized");
            }
            Team teammodel = await _teamService.GetTeamModel(data.Id);
            if (teammodel == null || teammodel.Player == null)
            {
                return Unauthorized("Unauthorized");
            }
            if (User.Identity.Name != teammodel.Player.UserName)
            {
                return Unauthorized("Unauthorized");
            }           
            bool deleted = await _teamService.DeleteTeamById(data.Id);
            if (!deleted)
            {
                return BadRequest("Failed to delete team.");
            }
            return Ok("Team successfully deleted.");
        }

        [HttpPost, Route("increment")]
        public async Task<ActionResult<string>> IncrementViewCount(TeamIdDTO data)
        {
            string response = await _teamService.IncrementTeamViewCount(data.Id);
            if (response.Equals("Team incremented"))
            {
                return Ok();
            }
            return BadRequest();
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [AllowAnonymous]
        [HttpPost, Route("query")]
        public async Task<ActionResult<TeamSearchQueryResponseDTO>> QueryTeams(TeamSearchQueryDTO key)
        {
            if (_identityService.CheckForRefresh(Request))
            {
                return Unauthorized("NoAccessTokenProvided");
            }
            else
            {
                string? validation = _teamService.ValidateTeamSearchQueryDTO(key);
                if (validation != null)
                {
                    return NotFound(validation);
                }
                int? langId = Converter.GetLangIDFromHttpContext(HttpContext);
                TeamSearchQueryResponseDTO teams = await _teamService.QueryTeams(key, langId ?? 9);
                if (teams == null)
                {
                    return NotFound("Couldn't find teams");
                }
                return Ok(teams);
            }
        }
    }
}
