using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Services;
using api.Util;
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
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int? langId = Converter.GetLangIDFromCode(langs[0].Value.ToString());

            var type = await _pokemonService.GetTypeWithEffectivenessByIdentifier(typeName, langId ?? 9);
            if (type == null)
            {
                return BadRequest("Type not found.");
            }
            return Ok(type);
        }

        [HttpGet("teratype/{typeName}", Name = "GetTeraTypeByIdentifier")]
        public async Task<ActionResult<PokeTypeWithEffectivenessDTO>> GetTeraTypeByIdentifier(string typeName)
        {
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int? langId = Converter.GetLangIDFromCode(langs[0].Value.ToString());

            var type = await _pokemonService.GetTypeWithEffectivenessByIdentifier(typeName, langId ?? 9, true);
            if (type == null)
            {
                return BadRequest("Type not found.");
            }
            return Ok(type);
        }

        [HttpGet("all", Name = "GetAllTypes")]
        public async Task<ActionResult<List<PokeTypeDTO>>> GetAllTypes()
        {
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int? langId = Converter.GetLangIDFromCode(langs[0].Value.ToString());

            var types = await _pokemonService.GetAllTypes(langId ?? 9);
            if (types == null)
            {
                return BadRequest("Type not found.");
            }
            return Ok(types);
        }

        [HttpGet("teratype/all", Name = "GetAllTeraTypes")]
        public async Task<ActionResult<List<PokeTypeDTO>>> GetAllTeraTypes()
        {
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int? langId = Converter.GetLangIDFromCode(langs[0].Value.ToString());

            var types = await _pokemonService.GetAllTeraTypes(langId ?? 9);
            if (types == null)
            {
                return BadRequest("Type not found.");
            }
            return Ok(types);
        }

        [HttpGet, Route("query")]
        public async Task<ActionResult<List<QueryResultDTO>>> QueryTypesByName(string key)
        {
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int? langId = Converter.GetLangIDFromCode(langs[0].Value.ToString());

            List<QueryResultDTO> types = await _pokemonService.QueryTypesByName(key, langId ?? 9);
            if (types == null)
            {
                return NotFound("Couldn't query types");
            }
            return Ok(types);
        }

        [HttpGet, Route("teratype/query")]
        public async Task<ActionResult<List<QueryResultDTO>>> QueryTeraTypesByName(string key)
        {
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int? langId = Converter.GetLangIDFromCode(langs[0].Value.ToString());

            List<QueryResultDTO> types = await _pokemonService.QueryTypesByName(key, langId ?? 9, true);
            if (types == null)
            {
                return NotFound("Couldn't query types");
            }
            return Ok(types);
        }

        [HttpGet("teratype/query/all")]
        public async Task<ActionResult<List<QueryResultDTO>>> QueryAllTeraTypes()
        {
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int? langId = Converter.GetLangIDFromCode(langs[0].Value.ToString());

            var types = await _pokemonService.QueryAllTeraTypes(langId ?? 9);
            if (types == null)
            {
                return BadRequest("Type not found.");
            }
            return Ok(types);
        }
    }
}
