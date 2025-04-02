using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Services;
using api.Services.PokedexServices;
using api.Util;
using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;

namespace api.Controllers.PokedexControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoveController : ControllerBase
    {
        private readonly IMoveService _moveService;
        public MoveController(IMoveService moveService)
        {
            _moveService = moveService;
        }

        [HttpGet("{moveName}", Name = "GetMoveByName")]
        public async Task<ActionResult<MoveDTO>> GetMoveByName(string moveName)
        {
            int? langId = Converter.GetLangIDFromHttpContext(HttpContext);
            var move = await _moveService.GetMoveByName(moveName, langId ?? 9);
            if (move == null)
            {
                return BadRequest("Move not found.");
            }
            return Ok(move);
        }

        [HttpGet, Route("query")]
        public async Task<ActionResult<List<QueryResultDTO>>> QueryMovesByName(string key)
        {
            int? langId = Converter.GetLangIDFromHttpContext(HttpContext);
            List<QueryResultDTO> moves = await _moveService.QueryMovesByName(key, langId ?? 9);
            if (moves == null)
            {
                return NotFound("Couldn't find moves");
            }
            return Ok(moves);
        }
    }
}
