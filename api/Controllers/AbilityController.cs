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
    public class AbilityController : ControllerBase
    {
        private readonly IPokedexService _pokemonService;
        public AbilityController(IPokedexService pokemonService)
        {
            _pokemonService = pokemonService;
        }

        [HttpGet("name/{abilityName}", Name = "GetAbilityByName")]
        public async Task<ActionResult<AbilityDTO>> GetAbilityByName(string abilityName)
        {
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int? langId = Converter.GetLangIDFromCode(langs[0].Value.ToString());

            var ability = await _pokemonService.GetAbilityByName(abilityName, langId ?? 9);
            if (ability == null)
            {
                return BadRequest("Ability not found.");
            }
            return Ok(ability);
        }

        [HttpGet("identifier/{abilityIdentifier}", Name = "GetAbilityByIdentifier")]
        public async Task<ActionResult<AbilityDTO>> GetAbilityByIdentifier(string abilityIdentifier)
        {
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int? langId = Converter.GetLangIDFromCode(langs[0].Value.ToString());

            var ability = await _pokemonService.GetAbilityByIdentifier(abilityIdentifier, langId ?? 9);
            if (ability == null)
            {
                return BadRequest("Ability not found.");
            }
            return Ok(ability);
        }

        [HttpGet, Route("all")]
        public async Task<ActionResult<List<QueryResultDTO>>> QueryAllAbilities()
        {
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int? langId = Converter.GetLangIDFromCode(langs[0].Value.ToString());

            List<QueryResultDTO> abilities = await _pokemonService.QueryAllAbilities(langId ?? 9);
            if (abilities == null)
            {
                return NotFound("Couldn't get all abilities");
            }
            return Ok(abilities);
        }

        [HttpGet, Route("pokemon/{id}")]
        public async Task<ActionResult<List<QueryResultDTO>>> QueryAllPokemonAbilites(string id)
        {
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int? langId = Converter.GetLangIDFromCode(langs[0].Value.ToString());

            List<QueryResultDTO> abilities = await _pokemonService.QueryAllPokemonAbilites(id, langId ?? 9);
            if (abilities == null)
            {
                return NotFound("Couldn't get pokemon abilities");
            }
            return Ok(abilities);
        }

        [HttpGet, Route("query")]
        public async Task<ActionResult<List<QueryResultDTO>>> QueryAbilitiesByName(string key)
        {
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int? langId = Converter.GetLangIDFromCode(langs[0].Value.ToString());

            List<QueryResultDTO> abilities = await _pokemonService.QueryAbilitiesByName(key, langId ?? 9);
            if (abilities == null)
            {
                return NotFound("Couldn't query abilities");
            }
            return Ok(abilities);
        }

        [HttpGet, Route("hidden")]
        public async Task<ActionResult<bool>> IsAbilityHidden(string abilityIdentifier, int dexNumber)
        {
            bool hidden = await _pokemonService.IsAbilityHidden(abilityIdentifier, dexNumber);
            return Ok(hidden);
        }
    }
}
