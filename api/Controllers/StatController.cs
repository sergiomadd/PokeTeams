using api.Services;
using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatController : ControllerBase
    {
        private readonly IPokedexService _pokemonService;
        public StatController(IPokedexService pokemonService)
        {
            _pokemonService = pokemonService;
        }

        [HttpGet("{identifier}", Name = "GetStatNameByIdentifier")]
        public async Task<ActionResult<string>> GetStatNameByIdentifier(string identifier)
        {
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int langId = _pokemonService.GetLangId(langs[0].Value.ToString());

            var statName = await _pokemonService.GetStatNameByIdentifier(identifier, langId);
            if (statName == null)
            {
                return BadRequest("Stat name not found.");
            }
            return Ok(statName);
        }
    }
}
