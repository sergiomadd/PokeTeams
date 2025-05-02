using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Services.PokedexServices;
using api.Util;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers.PokedexControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly IItemService _itemService;
        public ItemController(IItemService itemService)
        {
            _itemService = itemService;
        }

        [HttpGet("name/{itemName}", Name = "GetItemByName")]
        public async Task<ActionResult<ItemDTO?>> GetItemByName(string itemName)
        {
            int? langId = Converter.GetLangIDFromHttpContext(HttpContext);
            ItemDTO? item = await _itemService.GetItemByName(itemName, langId ?? 9);
            if (item == null)
            {
                return BadRequest("Item not found.");
            }
            return Ok(item);
        }

        [HttpGet("identifier/{itemIdentifier}", Name = "GetItemByIdentifier")]
        public async Task<ActionResult<ItemDTO>> GetItemByIdentifier(string itemIdentifier)
        {
            int? langId = Converter.GetLangIDFromHttpContext(HttpContext);
            var item = await _itemService.GetItemByIdentifier(itemIdentifier, langId ?? 9);
            if (item == null)
            {
                return BadRequest("Item not found.");
            }
            return Ok(item);
        }

        [HttpGet, Route("query")]
        public async Task<ActionResult<List<QueryResultDTO>>> QueryItemsByName(string key)
        {
            int? langId = Converter.GetLangIDFromHttpContext(HttpContext);
            List<QueryResultDTO> items = await _itemService.QueryItemsByName(key, langId ?? 9);
            if (items == null)
            {
                return NotFound("Couldn't find items");
            }
            return Ok(items);
        }
    }
}
