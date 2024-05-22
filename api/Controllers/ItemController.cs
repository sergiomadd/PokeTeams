using api.Data;
using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Services.PokedexService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly IPokedexService _pokemonService;
        public ItemController(IPokedexService pokemonService)
        {
            _pokemonService = pokemonService;
        }

        [HttpGet("name/{itemName}", Name = "GetItemByName")]
        public async Task<ActionResult<ItemDTO>> GetItemByName(string itemName)
        {
            var item = await _pokemonService.GetItemByName(itemName);
            if (item == null)
            {
                return BadRequest("Item not found.");
            }
            return Ok(item);
        }

        [HttpGet("identifier/{itemIdentifier}", Name = "GetItemByIdentifier")]
        public async Task<ActionResult<ItemDTO>> GetItemByIdentifier(string itemIdentifier)
        {
            var item = await _pokemonService.GetItemByIdentifier(itemIdentifier);
            if (item == null)
            {
                return BadRequest("Item not found.");
            }
            return Ok(item);
        }

        [HttpGet, Route("query")]
        public async Task<ActionResult<List<TagDTO>>> QueryItemsByName(string key)
        {
            List<TagDTO> items = _pokemonService.QueryItemsByName(key);
            if (items == null)
            {
                return NotFound("Couldn't find items");
            }
            return Ok(items);
        }
    }
}
