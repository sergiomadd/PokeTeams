using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Services;
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
            int langId = await _pokemonService.GetLangId(langs[0].Value.ToString());

            var ability = await _pokemonService.GetAbilityByName(abilityName, langId);
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
            int langId = await _pokemonService.GetLangId(langs[0].Value.ToString());

            var ability = await _pokemonService.GetAbilityByIdentifier(abilityIdentifier, langId);
            if (ability == null)
            {
                return BadRequest("Ability not found.");
            }
            return Ok(ability);
        }

        [HttpGet, Route("all")]
        public async Task<ActionResult<List<TagDTO>>> GetAllAbilities()
        {
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int langId = await _pokemonService.GetLangId(langs[0].Value.ToString());

            List<TagDTO> abilities = await _pokemonService.GetAllAbilitiesTags(langId);
            if (abilities == null)
            {
                return NotFound("Couldn't get pokemon abilities");
            }
            return Ok(abilities);
        }

        [HttpGet, Route("pokemon/{id}")]
        public async Task<ActionResult<List<TagDTO>>> GetPokemonAbilities(string id)
        {
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int langId = await _pokemonService.GetLangId(langs[0].Value.ToString());

            List<TagDTO> abilities = await _pokemonService.GetPokemonAbilites(id, langId);
            if (abilities == null)
            {
                return NotFound("Couldn't get pokemon abilities");
            }
            return Ok(abilities);
        }

        [HttpGet, Route("query")]
        public async Task<ActionResult<List<TagDTO>>> QueryAbilitiesByName(string key)
        {
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int langId = await _pokemonService.GetLangId(langs[0].Value.ToString());

            List<TagDTO> abilities = await _pokemonService.QueryAbilitiesByName(key, langId);
            if (abilities == null)
            {
                return NotFound("Couldn't query abilities");
            }
            return Ok(abilities);
        }
    }
}
