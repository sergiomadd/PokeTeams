using api.Models.DBPoketeamModels.Pokemon;
using api.Services.PokedexService;
using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoveController : ControllerBase
    {
        private readonly IPokedexService _pokemonService;
        public MoveController(IPokedexService pokemonService)
        {
            _pokemonService = pokemonService;
        }

        [HttpGet("{moveName}", Name = "GetMoveByName")]
        public async Task<ActionResult<Move>> GetMoveByName(string moveName)
        {
            var move = await _pokemonService.GetMoveByName(moveName);
            if (move == null)
            {
                return BadRequest("Move not found.");
            }
            return Ok(move);
        }
    }
}
