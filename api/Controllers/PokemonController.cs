using api.Data;
using api.DTOs.PokemonDTOs;
using api.Models.DBModels;
using api.Services.PokedexService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
            var pokemon = await _pokemonService.GetPokemonByName(pokemonName);
            if(pokemon == null)
            {
                return BadRequest("Pokemon not found.");
            }
            return Ok(pokemon);
        }
    }
}
