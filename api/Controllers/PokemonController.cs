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
    public class PokemonController : ControllerBase
    {
        private readonly IPokemonService _pokemonService;
        public PokemonController(IPokemonService pokemonService)
        {
            _pokemonService = pokemonService;
        }

        [HttpGet(Name = "GetAllPokemon")]
        public async Task<ActionResult<List<Pokemon>>> Get()
        {
            var pokemons = await _pokemonService.GetAllPokemon();
            if (pokemons == null)
            {
                return BadRequest("Pokemons not found.");
            }
            return Ok(pokemons);
        }

        [HttpGet("{id}", Name = "GetPokemonById")]
        public async Task<ActionResult<Pokemon>> Get(int id) 
        {
            var pokemon = await _pokemonService.GetPokemonById(id);
            if(pokemon == null)
            {
                return BadRequest("Pokemon not found.");
            }
            return Ok(pokemon);
        }
    }
}
