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
            var ability = await _pokemonService.GetAbilityByName(abilityName);
            if (ability == null)
            {
                return BadRequest("Ability not found.");
            }
            return Ok(ability);
        }

        [HttpGet("identifier/{abilityIdentifier}", Name = "GetAbilityByIdentifier")]
        public async Task<ActionResult<AbilityDTO>> GetAbilityByIdentifier(string abilityIdentifier)
        {
            var ability = await _pokemonService.GetAbilityByIdentifier(abilityIdentifier);
            if (ability == null)
            {
                return BadRequest("Ability not found.");
            }
            return Ok(ability);
        }

        [HttpGet, Route("pokemon/{id}")]
        public async Task<ActionResult<List<TagDTO>>> GetPokemonAbilities(string id)
        {
            List<TagDTO> abilities = await _pokemonService.GetPokemonAbilites(id);
            if (abilities == null)
            {
                return NotFound("Couldn't get pokemon abilities");
            }
            return Ok(abilities);
        }

        [HttpGet, Route("query")]
        public async Task<ActionResult<List<TagDTO>>> QueryAbilitiesByName(string key)
        {
            List<TagDTO> abilities = _pokemonService.QueryAbilitiesByName(key);
            if (abilities == null)
            {
                return NotFound("Couldn't query abilities");
            }
            return Ok(abilities);
        }
    }
}
