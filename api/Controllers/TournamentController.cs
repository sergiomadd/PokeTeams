using api.DTOs;
using api.Models.DBPoketeamModels;
using api.Services;
using api.Util;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TournamentController : ControllerBase
    {
        private readonly ITournamentService _tournamentService;

        public TournamentController(ITournamentService tournamentService)
        {
            _tournamentService = tournamentService;
        }

        [HttpGet("all")]
        public async Task<ActionResult<List<TournamentDTO>>> GetAllTournaments()
        {
            List<TournamentDTO> tournamentDTOs = await _tournamentService.GetAllTournaments();
            if (tournamentDTOs == null)
            {
                return NotFound("Couldn't find tournament");
            }
            return Ok(tournamentDTOs);
        }

        [HttpGet("{normalizedName}")]
        public async Task<ActionResult<TournamentDTO>> Get(string normalizedName)
        {
            TournamentDTO? tournamentDTO = await _tournamentService.GetTournamentByNormalizedName(normalizedName);
            if (tournamentDTO == null)
            {
                return NotFound("Couldn't find tournament");
            }
            return Ok(tournamentDTO);
        }

        [HttpPost]
        public async Task<ActionResult<object>> Post([FromBody] TournamentDTO tournamentDTO)
        {
            Tournament? newTournament = await _tournamentService.SaveTournament(tournamentDTO);
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

        [HttpGet("query/all")]
        public async Task<ActionResult<List<QueryResultDTO>>> QueryAllTournaments()
        {
            List<QueryResultDTO> results = await _tournamentService.QueryAllTournaments();
            if (results == null)
            {
                return NotFound("Couldn't find tournaments");
            }
            return Ok(results);
        }

        [HttpGet, Route("query")]
        public async Task<ActionResult<List<QueryResultDTO>>> QueryTournamentsByNormalizedName(string key)
        {
            List<QueryResultDTO> tournaments = await _tournamentService.QueryTournamentsByNormalizedName(key);
            if (tournaments == null)
            {
                return NotFound("Couldn't find tournaments");
            }
            return Ok(tournaments);
        }
    }
}
