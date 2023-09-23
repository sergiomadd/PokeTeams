using api.Services.PokemonService;
using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoveController : ControllerBase
    {
        private readonly IPokemonService _pokemonService;
        public MoveController(IPokemonService pokemonService)
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
