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
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int langId = await _pokemonService.GetLangId(langs[0].Value.ToString());

            var move = await _pokemonService.GetMoveByName(moveName, langId);
            if (move == null)
            {
                return BadRequest("Move not found.");
            }
            return Ok(move);
        }

        [HttpGet, Route("query")]
        public async Task<ActionResult<List<QueryResultDTO>>> QueryMovesByName(string key)
        {
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int langId = await _pokemonService.GetLangId(langs[0].Value.ToString());

            List<QueryResultDTO> moves = await _pokemonService.QueryMovesByName(key, langId);
            if (moves == null)
            {
                return NotFound("Couldn't find moves");
            }
            return Ok(moves);
        }


        [HttpGet, Route("pokemon/{id}")]
        public async Task<ActionResult<List<QueryResultDTO>>> QueryAllPokemonMoves(string id)
        {
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int langId = await _pokemonService.GetLangId(langs[0].Value.ToString());

            List<QueryResultDTO> moves = await _pokemonService.QueryAllPokemonMoves(id, langId);
            if (moves == null)
            {
                return NotFound("Couldn't get pokemon moves");
            }
            return Ok(moves);
        }
    }
}
