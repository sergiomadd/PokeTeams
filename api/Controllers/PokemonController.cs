using api.Data;
using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Models;
using api.Models.DBModels;
using api.Services;
using api.Util;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PokemonController : ControllerBase
    {
        private readonly IPokedexService _pokemonService;
        public PokemonController(IPokedexService pokemonService)
        {
            _pokemonService = pokemonService;
        }

        [HttpGet("{pokemonName}", Name = "GetPokemonByName")]
        public async Task<ActionResult<PokemonDataDTO>> GetPokemonByName(string pokemonName) 
        {
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int langId = _pokemonService.GetLangId(langs[0].Value.ToString());

            var pokemon = await _pokemonService.GetPokemonByName(pokemonName, langId);
            if(pokemon == null)
            {
                return NotFound("Pokemon not found.");
            }
            return Ok(pokemon);
        }

        [HttpGet, Route("query")]
        public async Task<ActionResult<List<TagDTO>>> QueryPokemonsByName(string key)
        {
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int langId = _pokemonService.GetLangId(langs[0].Value.ToString());

            List<TagDTO> pokemons = _pokemonService.QueryPokemonsByName(key, langId);
            if (pokemons == null)
            {
                return NotFound("Couldn't find pokemons");
            }
            return Ok(pokemons);
        }
    }
}
