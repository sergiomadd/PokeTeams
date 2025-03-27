using api.Data;
using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Services;
using api.Services.PokedexServices;
using api.Util;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int? langId = Converter.GetLangIDFromCode(langs[0].Value.ToString());

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
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int? langId = Converter.GetLangIDFromCode(langs[0].Value.ToString());

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
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int? langId = Converter.GetLangIDFromCode(langs[0].Value.ToString());

            List<QueryResultDTO> items = await _itemService.QueryItemsByName(key, langId ?? 9);
            if (items == null)
            {
                return NotFound("Couldn't find items");
            }
            return Ok(items);
        }
    }
}
