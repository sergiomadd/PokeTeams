using api.DTOs.PokemonDTOs;
using api.Services.PokedexService;
using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TypeController : ControllerBase
    {
        private readonly IPokedexService _pokemonService;
        public TypeController(IPokedexService pokemonService)
        {
            _pokemonService = pokemonService;
        }

        [HttpGet("{typeName}", Name = "GetTypeByIdentifier")]
        public async Task<ActionResult<PokeTypeWithEffectivenessDTO>> GetTypeByIdentifier(string typeName)
        {
            var type = await _pokemonService.GetTypeWithEffectivenessByIdentifier(typeName);
            if (type == null)
            {
                return BadRequest("Yype not found.");
            }
            return Ok(type);
        }
    }
}
