using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Services.PokedexServices;
using api.Util;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TypeController : ControllerBase
    {
        private readonly ITypeService _typeService;
        public TypeController(ITypeService pokemonService)
        {
            _typeService = pokemonService;
        }

        [HttpGet("{typeName}", Name = "GetTypeByIdentifier")]
        public async Task<ActionResult<PokeTypeWithEffectivenessDTO>> GetTypeByIdentifier(string typeName)
        {
            int? langId = Converter.GetLangIDFromHttpContext(HttpContext);
            var type = await _typeService.GetTypeWithEffectivenessByIdentifier(typeName, langId ?? 9);
            if (type == null)
            {
                return BadRequest("Type not found.");
            }
            return Ok(type);
        }

        [HttpGet("teratype/{typeName}", Name = "GetTeraTypeByIdentifier")]
        public async Task<ActionResult<PokeTypeWithEffectivenessDTO>> GetTeraTypeByIdentifier(string typeName)
        {
            int? langId = Converter.GetLangIDFromHttpContext(HttpContext);
            var type = await _typeService.GetTypeWithEffectivenessByIdentifier(typeName, langId ?? 9, true);
            if (type == null)
            {
                return BadRequest("Type not found.");
            }
            return Ok(type);
        }

        [HttpGet("all", Name = "GetAllTypes")]
        public async Task<ActionResult<List<PokeTypeDTO>>> GetAllTypes()
        {
            int? langId = Converter.GetLangIDFromHttpContext(HttpContext);
            var types = await _typeService.GetAllTypes(langId ?? 9);
            if (types == null)
            {
                return BadRequest("Type not found.");
            }
            return Ok(types);
        }

        [HttpGet("teratype/all", Name = "GetAllTeraTypes")]
        public async Task<ActionResult<List<PokeTypeDTO>>> GetAllTeraTypes()
        {
            int? langId = Converter.GetLangIDFromHttpContext(HttpContext);
            var types = await _typeService.GetAllTeraTypes(langId ?? 9);
            if (types == null)
            {
                return BadRequest("Type not found.");
            }
            return Ok(types);
        }

        [HttpGet, Route("query")]
        public async Task<ActionResult<List<QueryResultDTO>>> QueryTypesByName(string key)
        {
            int? langId = Converter.GetLangIDFromHttpContext(HttpContext);
            List<QueryResultDTO> types = await _typeService.QueryTypesByName(key, langId ?? 9);
            if (types == null)
            {
                return NotFound("Couldn't query types");
            }
            return Ok(types);
        }

        [HttpGet, Route("teratype/query")]
        public async Task<ActionResult<List<QueryResultDTO>>> QueryTeraTypesByName(string key)
        {
            int? langId = Converter.GetLangIDFromHttpContext(HttpContext);
            List<QueryResultDTO> types = await _typeService.QueryTypesByName(key, langId ?? 9, true);
            if (types == null)
            {
                return NotFound("Couldn't query types");
            }
            return Ok(types);
        }

        [HttpGet("teratype/query/all")]
        public async Task<ActionResult<List<QueryResultDTO>>> QueryAllTeraTypes()
        {
            int? langId = Converter.GetLangIDFromHttpContext(HttpContext);
            var types = await _typeService.QueryAllTeraTypes(langId ?? 9);
            if (types == null)
            {
                return BadRequest("Type not found.");
            }
            return Ok(types);
        }
    }
}
