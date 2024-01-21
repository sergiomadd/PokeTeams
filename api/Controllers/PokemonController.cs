using api.Data;
using api.Models.DBModels;
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

        [HttpGet("{pokemonName}", Name = "GetPokemonByName")]
        public async Task<ActionResult<PokemonData>> GetPokemonByName(string pokemonName) 
        {
            var pokemon = await _pokemonService.GetPokemonByName(pokemonName);
            if(pokemon == null)
            {
                return BadRequest("Pokemon not found.");
            }
            return Ok(pokemon);
        }
    }
}
