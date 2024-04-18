using api.Models.DBModels;
using api.Models.DBPoketeamModels.Pokemon;
using api.Services.PokedexService;
using api.Util;
using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NatureController : ControllerBase
    {
        private readonly IPokedexService _pokemonService;
        public NatureController(IPokedexService pokemonService)
        {
            _pokemonService = pokemonService;
        }

        [HttpGet("name/{natureName}", Name = "GetNatureByName")]
        public async Task<ActionResult<Nature>> GetNatureByName(string natureName)
        {
            var nature = await _pokemonService.GetNatureByName(natureName);
            if (nature == null)
            {
                return BadRequest("Nature not found.");
            }
            return Ok(nature);
        }

        [HttpGet("identifier/{natureIdentifier}", Name = "GetNatureByIdentifier")]
        public async Task<ActionResult<Nature>> GetNatureByIdentifier(string natureIdentifier)
        {
            var nature = await _pokemonService.GetNatureByIdentifier(natureIdentifier);
            if (nature == null)
            {
                return BadRequest("Nature not found.");
            }
            return Ok(nature);
        }
    }
}
