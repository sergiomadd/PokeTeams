using api.Services.PokemonService;
using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NatureController : ControllerBase
    {
        private readonly IPokemonService _pokemonService;
        public NatureController(IPokemonService pokemonService)
        {
            _pokemonService = pokemonService;
        }

        [HttpGet("{natureName}", Name = "GetNatureByName")]
        public async Task<ActionResult<Nature>> GetNatureByName(string natureName)
        {
            var nature = await _pokemonService.GetNatureByName(natureName);
            if (nature == null)
            {
                return BadRequest("Nature not found.");
            }
            return Ok(nature);
        }
    }
}
