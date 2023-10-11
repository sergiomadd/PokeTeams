using api.Services.PokemonService;
using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatController : ControllerBase
    {
        private readonly IPokemonService _pokemonService;
        public StatController(IPokemonService pokemonService)
        {
            _pokemonService = pokemonService;
        }

        [HttpGet("{identifier}", Name = "GetStatNameByIdentifier")]
        public async Task<ActionResult<string>> GetStatNameByIdentifier(string identifier)
        {
            var statName = await _pokemonService.GetStatNameByIdentifier(identifier);
            if (statName == null)
            {
                return BadRequest("Stat name not found.");
            }
            return Ok(statName);
        }
    }
}
