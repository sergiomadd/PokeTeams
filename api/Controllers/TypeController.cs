using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Services;
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
                return BadRequest("Type not found.");
            }
            return Ok(type);
        }

        [HttpGet("teratype/{typeName}", Name = "GetTeraTypeByIdentifier")]
        public async Task<ActionResult<PokeTypeWithEffectivenessDTO>> GetTeraTypeByIdentifier(string typeName)
        {
            var type = await _pokemonService.GetTypeWithEffectivenessByIdentifier(typeName, true);
            if (type == null)
            {
                return BadRequest("Type not found.");
            }
            return Ok(type);
        }

        [HttpGet("all", Name = "GetAllTypes")]
        public async Task<ActionResult<List<PokeTypeDTO>>> GetAllTypes()
        {
            var types = await _pokemonService.GetAllTypes();
            if (types == null)
            {
                return BadRequest("Type not found.");
            }
            return Ok(types);
        }

        [HttpGet("teratype/all", Name = "GetAllTeraTypes")]
        public async Task<ActionResult<List<PokeTypeDTO>>> GetAllTeraTypes()
        {
            var types = await _pokemonService.GetAllTeraTypes();
            if (types == null)
            {
                return BadRequest("Type not found.");
            }
            return Ok(types);
        }

        [HttpGet, Route("query")]
        public async Task<ActionResult<List<TagDTO>>> QueryTypesByName(string key)
        {
            List<TagDTO> types = _pokemonService.QueryTypesByName(key);
            if (types == null)
            {
                return NotFound("Couldn't query types");
            }
            return Ok(types);
        }

        [HttpGet, Route("teratype/query")]
        public async Task<ActionResult<List<TagDTO>>> QueryTeraTypesByName(string key)
        {
            List<TagDTO> types = _pokemonService.QueryTypesByName(key, true);
            if (types == null)
            {
                return NotFound("Couldn't query types");
            }
            return Ok(types);
        }
    }
}
