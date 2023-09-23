using api.Services.PokemonService;
using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;

namespace api.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class AbilityController : ControllerBase
    {
        private readonly IPokemonService _pokemonService;
        public AbilityController(IPokemonService pokemonService)
        {
            _pokemonService = pokemonService;
        }

        [HttpGet("{abilityName}", Name = "GetAbilityByName")]
        public async Task<ActionResult<Ability>> GetAbilityByName(string abilityName)
        {
            var ability = await _pokemonService.GetAbilityByName(abilityName);
            if (ability == null)
            {
                return BadRequest("Ability not found.");
            }
            return Ok(ability);
        }
    }
}
