using api.DTOs.PokemonDTOs;
using api.Services.PokedexServices;
using api.Util;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers.PokedexControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatController : ControllerBase
    {
        private readonly IStatService _statService;
        public StatController(IStatService statService)
        {
            _statService = statService;
        }

        [HttpGet("default", Name = "GetDefaultStatList")]
        public async Task<ActionResult<List<StatDTO>>> GetDefaultStatList()
        {
            int? langId = Converter.GetLangIDFromHttpContext(HttpContext);
            var defaultStats = await _statService.GetDefaultStatList(langId ?? 9);
            if (defaultStats == null)
            {
                return BadRequest("Error getting default stats");
            }
            return Ok(defaultStats);
        }

        [HttpGet("{identifier}", Name = "GetStatNameByIdentifier")]
        public async Task<ActionResult<string>> GetStatNameByIdentifier(string identifier)
        {
            int? langId = Converter.GetLangIDFromHttpContext(HttpContext);
            var statName = await _statService.GetStatNameByIdentifier(identifier, langId ?? 9);
            if (statName == null)
            {
                return BadRequest("Stat name not found.");
            }
            return Ok(statName);
        }

        [HttpGet("pokemon", Name = "GetPokemonStats")]
        public async Task<ActionResult<List<StatDTO>>> GetPokemonStats(int id)
        {
            int? langId = Converter.GetLangIDFromHttpContext(HttpContext);
            var stats = await _statService.GetPokemonStats(id, langId ?? 9);
            if (stats == null)
            {
                return BadRequest("Error getting pokemon stats");
            }
            return Ok(stats);
        }
    }
}
