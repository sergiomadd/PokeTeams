using Microsoft.AspNetCore.Mvc;
using api.Models.DBPoketeamModels;
using api.Util;
using api.DTOs;
using api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using api.Middlewares;
using Microsoft.AspNetCore.RateLimiting;

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
        [EnableRateLimiting("teamGetLimiter")]
        [RateLimitResponse("Too many requests, try again in a bit.")]
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
                else if (team.ID == "unauthorized")
                {
                    return Unauthorized("This team is private");
                }
                return Ok(team);
            }
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [AllowAnonymous]
        [EnableRateLimiting("teamGetLimiter")]
        [RateLimitResponse("Too many requests, try again in a bit.")]
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
                else if (team.ID == "unauthorized")
                {
                    return Unauthorized("This team is private");
                }
                return Ok(team);
            }
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [AllowAnonymous]
        [EnableRateLimiting("teamUploadLimiter")]
        [RateLimitResponse("Too many uploads, try again later.")]
        [HttpPost, Route("save")]
        public async Task<ActionResult> SaveTeam([FromBody] TeamDTO? teamDTO)
        {
            if (_identityService.CheckForRefresh(Request))
            {
                return Unauthorized("NoAccessTokenProvided");
            }
            else
            {
                string? validation = _teamService.ValidateTeamDTO(teamDTO);
                if (validation != null)
                {
                    return BadRequest(validation);
                }
                Team? newTeam = await _teamService.SaveTeam(teamDTO!);
                if (newTeam == null)
                {
                    return BadRequest("Error saving team, try again please");
                }
                return Ok(newTeam.Id);
            }
        }

        [EnableRateLimiting("teamUploadLimiter")]
        [RateLimitResponse("Too many uploads, try again later.")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost, Route("update")]
        public async Task<ActionResult<string>> Update(TeamDTO? teamDTO)
        {
            string? validation = _teamService.ValidateTeamDTO(teamDTO);
            if (validation != null)
            {
                return BadRequest(validation);
            }
            Team? currentTeam = await _teamService.GetTeamModel(teamDTO!.ID);
            if (currentTeam == null || currentTeam.Player == null)
            {
                return Unauthorized("Unauthorized A");
            }
            User? loggedUser = await _identityService.GetLoggedUser();
            if (loggedUser?.Id == null || loggedUser.Id != currentTeam.Player.Id)
            {
                return Unauthorized("Unauthorized B");
            }
            Team? newTeam = await _teamService.UpdateTeam(teamDTO, teamDTO.ID);
            if (newTeam == null)
            {
                return BadRequest("Could not update team");
            }
            return Ok(newTeam.Id);
        }

        [EnableRateLimiting("teamSearchLimiter")]
        [RateLimitResponse("Wait a bit before deleting again.")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost, Route("delete")]
        public async Task<ActionResult<string>> Delete([FromBody] TeamIdDTO? data)
        {
            if(data == null || data.Id == null)
            {
                return Unauthorized("Wrong data");
            }
            Team? teamModel = await _teamService.GetTeamModel(data.Id);
            if (teamModel == null || teamModel.Player == null)
            {
                return Unauthorized("Team not found");
            }
            User? loggedUser = await _identityService.GetLoggedUser();
            if (loggedUser?.Id == null || loggedUser.Id != teamModel.Player.Id)
            {
                return Unauthorized("Unauthorized");
            }           
            bool deleted = await _teamService.DeleteTeamById(data.Id);
            if (!deleted)
            {
                return BadRequest("Failed to delete team");
            }
            return Ok("Team successfully deleted");
        }

        [HttpPost, Route("increment")]
        public async Task<ActionResult<string>> IncrementViewCount(TeamIdDTO data)
        {
            string response = await _teamService.IncrementTeamViewCount(data.Id);
            if (response.Equals("Team incremented"))
            {
                return Ok();
            }
            return BadRequest(response);
        }

        [EnableRateLimiting("teamSearchLimiter")]
        [RateLimitResponse("Wait a bit before searching again.")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [AllowAnonymous]
        [HttpPost, Route("query")]
        public async Task<ActionResult<TeamSearchQueryResponseDTO>> QueryTeams(TeamSearchQueryDTO? key)
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
                    return BadRequest(validation);
                }
                int? langId = Converter.GetLangIDFromHttpContext(HttpContext);
                TeamSearchQueryResponseDTO teams = await _teamService.QueryTeams(key!, langId ?? 9);
                return Ok(teams);
            }
        }
    }
}
