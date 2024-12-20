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
        public ActionResult<List<TournamentDTO>> GetAllTournaments()
        {
            List<TournamentDTO> tournamentDTOs = _tournamentService.GetAllTournaments();
            if (tournamentDTOs == null)
            {
                return NotFound("Couldn't find tournament");
            }
            return Ok(tournamentDTOs);
        }

        [HttpGet("{name}")]
        public async Task<ActionResult<TournamentDTO>> Get(string name)
        {
            TournamentDTO tournamentDTO = await _tournamentService.GetTournamentByName(name);
            if (tournamentDTO == null)
            {
                return NotFound("Couldn't find tournament");
            }
            return Ok(tournamentDTO);
        }

        [HttpPost]
        public async Task<ActionResult<object>> Post([FromBody] TournamentDTO tournamentDTO)
        {
            Tournament newTournament = await _tournamentService.SaveTournament(tournamentDTO);
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

        [HttpGet, Route("query")]
        public async Task<ActionResult<List<TagDTO>>> QueryTournamentsByName(string key)
        {
            List<TagDTO> tournaments = _tournamentService.QueryTournamentsByName(key);
            if (tournaments == null)
            {
                return NotFound("Couldn't find tournaments");
            }
            return Ok(tournaments);
        }

        [HttpGet, Route("check/{tournamentName}")]
        public async Task<ActionResult<bool>> TournamentAvailable(string tournamentName)
        {
            bool available = _tournamentService.TournamentAvailable(tournamentName);
            if (!available)
            {
                return Ok(false);
            }
            return Ok(true);
        }
    }
}
