using api.DTOs;
using api.Models.DBPoketeamModels;
using api.Services.TeamService;
using api.Util;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TournamentController : ControllerBase
    {
        private readonly IPokeTeamService _teamService;

        public TournamentController(IPokeTeamService teamService)
        {
            _teamService = teamService;
        }
        
        [HttpGet("{name}")]
        public async Task<ActionResult<TournamentDTO>> Get(string name)
        {
            Printer.Log("Getting team");
            TournamentDTO tournamentDTO = await _teamService.GetTournamentByName(name);
            if (tournamentDTO == null)
            {
                return NotFound("Couldn't find tournament");
            }
            return Ok(tournamentDTO);
        }

        [HttpPost]
        public async Task<ActionResult<object>> Post([FromBody] TournamentDTO tournamentDTO)
        {
            Tournament newTournament = await _teamService.SaveTournament(tournamentDTO);
            if (newTournament == null)
            {
                object response = new
                {
                    content = $"Failed to upload tournament."
                };
                return BadRequest(response);
            }
            else
            {
                object response = new
                {
                    content = newTournament.Name
                };
                return Ok(response);
            }
        }
    }
}
