using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Services;
using api.Util;
using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoveController : ControllerBase
    {
        private readonly IPokedexService _pokemonService;
        public MoveController(IPokedexService pokemonService)
        {
            _pokemonService = pokemonService;
        }

        [HttpGet("{moveName}", Name = "GetMoveByName")]
        public async Task<ActionResult<MoveDTO>> GetMoveByName(string moveName)
        {
            var move = await _pokemonService.GetMoveByName(moveName);
            if (move == null)
            {
                return BadRequest("Move not found.");
            }
            return Ok(move);
        }

        [HttpGet, Route("query")]
        public async Task<ActionResult<List<TagDTO>>> QueryMovesByName(string key)
        {
            List<TagDTO> moves = _pokemonService.QueryMovesByName(key);
            if (moves == null)
            {
                return NotFound("Couldn't find moves");
            }
            return Ok(moves);
        }


        [HttpGet, Route("pokemon/{id}")]
        public async Task<ActionResult<List<TagDTO>>> GetPokemonMoves(string id)
        {
            List<TagDTO> moves = await _pokemonService.GetPokemonMoves(id);
            if (moves == null)
            {
                return NotFound("Couldn't get pokemon moves");
            }
            return Ok(moves);
        }
    }
}
