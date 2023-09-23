using api.Data;
using api.Models;
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

        [HttpGet(Name = "GetItems")]
        public async Task<ActionResult<List<Item_names>>> GetItems()
        {
            var item = await _pokemonService.GetItems();
            if (item == null)
            {
                return BadRequest("Items not found.");
            }
            return Ok(item);
        }

        [HttpGet("{itemName}", Name = "GetItemByName")]
        public async Task<ActionResult<ItemModel>> GetItemByName(string itemName)
        {
            var item = await _pokemonService.GetItemByName(itemName);
            if (item == null)
            {
                return BadRequest("Item not found.");
            }
            return Ok(item);
        }
    }
}
