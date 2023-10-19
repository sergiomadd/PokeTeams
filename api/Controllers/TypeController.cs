using api.Services.PokemonService;
using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TypeController : ControllerBase
    {
        private readonly IPokemonService _pokemonService;
        public TypeController(IPokemonService pokemonService)
        {
            _pokemonService = pokemonService;
        }

        [HttpGet("{typeName}", Name = "GetTypeByIdentifier")]
        public async Task<ActionResult<PokeType>> GetTypeByIdentifier(string typeName)
        {
            var type = await _pokemonService.GetTypeByIdentifier(typeName);
            if (type == null)
            {
                return BadRequest("Yype not found.");
            }
            return Ok(type);
        }

        [HttpGet("teratype/{typeName}", Name = "GetTeraTypeByIdentifier")]
        public async Task<ActionResult<PokeType>> GetTeraTypeByIdentifier(string typeName)
        {
            var type = await _pokemonService.GetTeraTypeByIdentifier(typeName);
            if (type == null)
            {
                return BadRequest("Yype not found.");
            }
            return Ok(type);
        }
    }
}
