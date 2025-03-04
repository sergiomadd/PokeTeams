using api.Data;
using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Services;
using api.Util;
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
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int? langId = Converter.GetLangIDFromCode(langs[0].Value.ToString());

            var item = await _pokemonService.GetItemByName2(itemName, langId ?? 9);
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

            var item = await _pokemonService.GetItemByIdentifier2(itemIdentifier, langId ?? 9);
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

            List<QueryResultDTO> items = await _pokemonService.QueryItemsByName(key, langId ?? 9);
            if (items == null)
            {
                return NotFound("Couldn't find items");
            }
            return Ok(items);
        }
    }
}
