using api.Data;
using api.Models.DBPoketeamModels.Pokemon;
using api.Services.PokemonService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly IPokemonService _pokemonService;
        public ItemController(IPokemonService pokemonService)
        {
            _pokemonService = pokemonService;
        }

        [HttpGet("name/{itemName}", Name = "GetItemByName")]
        public async Task<ActionResult<Item>> GetItemByName(string itemName)
        {
            var item = await _pokemonService.GetItemByName(itemName);
            if (item == null)
            {
                return BadRequest("Item not found.");
            }
            return Ok(item);
        }

        [HttpGet("identifier/{itemIdentifier}", Name = "GetItemByIdentifier")]
        public async Task<ActionResult<Item>> GetItemByIdentifier(string itemIdentifier)
        {
            var item = await _pokemonService.GetItemByIdentifier(itemIdentifier);
            if (item == null)
            {
                return BadRequest("Item not found.");
            }
            return Ok(item);
        }
    }
}
