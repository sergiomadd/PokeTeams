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

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeamController : ControllerBase
    {
        private readonly IPokeTeamService _teamService;
        private readonly IPokedexService _pokemonService;
        private readonly IIdentityService _identityService;

        public TeamController(IPokeTeamService teamService, IPokedexService pokemonService, IIdentityService identityService)
        {
            _teamService = teamService;
            _pokemonService = pokemonService;
            _identityService = identityService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TeamDTO>> Get(string id)
        {
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int langId = await _pokemonService.GetLangId(langs[0].Value.ToString());

            var team = await _teamService.GetTeam(id, langId);
            if (team == null)
            {
                return BadRequest("Team not found.");
            }
            return Ok(team);
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [AllowAnonymous]
        [HttpGet("data/{id}")]
        public async Task<ActionResult<TeamDataDTO>> GetTeamData(string id)
        {
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int langId = await _pokemonService.GetLangId(langs[0].Value.ToString());

            var team = await _teamService.GetTeamData(id, langId);
            if (team == null)
            {
                return BadRequest("Team data not found.");
            }
            return Ok(team);
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [AllowAnonymous]
        [HttpGet("pokemon/{pokemonId}")]
        public async Task<ActionResult<PokemonDTO>> GetPokemonById(int pokemonId)
        {
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int langId = await _pokemonService.GetLangId(langs[0].Value.ToString());

            var pokemonDTO = await _teamService.GetPokemonById(pokemonId, langId);

            if (pokemonDTO == null)
            {
                return NotFound("Pokemon not found.");
            }
            return Ok(pokemonDTO);
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [AllowAnonymous]
        [HttpGet("pokemon/nolang/{pokemonId}")]
        public async Task<ActionResult<PokemonDTO>> GetPokemonByIdNoLang(int pokemonId)
        {
            var pokemonDTO = await _teamService.GetPokemonById(pokemonId, (int)Lang.en);

            if (pokemonDTO == null)
            {
                return NotFound("Pokemon not found.");
            }
            return Ok(pokemonDTO);
        }

        [HttpGet("pokemon-previews/{teamId}")]
        public async Task<ActionResult<List<PokemonPreviewDTO>>> GetTeamPreviewPokemons(string teamId)
        {
            if(teamId == null)
            {
                return BadRequest("Team id is null");
            }

            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int langId = await _pokemonService.GetLangId(langs[0].Value.ToString());

            var pokemonDTO = await _teamService.GetTeamPreviewPokemons(teamId, langId);

            if (pokemonDTO == null)
            {
                return NotFound("Pokemon not found.");
            }
            return Ok(pokemonDTO);
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult<string>> Post([FromBody] TeamDTO team)
        {
            Team newTeam = await _teamService.SaveTeam(team, User.Identity.Name);
            if (newTeam == null)
            {
                return BadRequest();
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
        [HttpPost, Route("update")]
        public async Task<ActionResult<string>> Update([FromBody] TeamDTO teamDTO)
        {
            Team? currentTeam = await _teamService.GetTeamModel(teamDTO.ID);
            if (currentTeam == null || currentTeam.Player == null)
            {
                return Unauthorized("Unauthorized");
            }
            User? loggedUser = await _identityService.GetUser();
            if (loggedUser.Id == null || loggedUser.Id != currentTeam.Player.Id)
            {
                return Unauthorized("Unauthorized");
            }
            Team? newTeam = await _teamService.UpdateTeam(teamDTO, teamDTO.ID, User.Identity.Name);
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
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int langId = await _pokemonService.GetLangId(langs[0].Value.ToString());

            TeamSearchQueryResponseDTO teams = await _teamService.QueryTeams(key, langId);
            if (teams == null)
            {
                return NotFound("Couldn't find teams");
            }
            return Ok(teams);
        }
    }
}
