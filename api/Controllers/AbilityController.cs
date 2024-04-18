using api.Models.DBPoketeamModels.Pokemon;
using api.Services.PokedexService;
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
        public async Task<ActionResult<Ability>> GetAbilityByName(string abilityName)
        {
            var ability = await _pokemonService.GetAbilityByName(abilityName);
            if (ability == null)
            {
                return BadRequest("Ability not found.");
            }
            return Ok(ability);
        }

        [HttpGet("identifier/{abilityIdentifier}", Name = "GetAbilityByIdentifier")]
        public async Task<ActionResult<Ability>> GetAbilityByIdentifier(string abilityIdentifier)
        {
            var ability = await _pokemonService.GetAbilityByIdentifier(abilityIdentifier);
            if (ability == null)
            {
                return BadRequest("Ability not found.");
            }
            return Ok(ability);
        }
    }
}
