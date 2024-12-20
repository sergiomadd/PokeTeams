using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Models.DBModels;
using api.Services;
using api.Util;
using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NatureController : ControllerBase
    {
        private readonly IPokedexService _pokemonService;
        public NatureController(IPokedexService pokemonService)
        {
            _pokemonService = pokemonService;
        }

        [HttpGet("name/{natureName}", Name = "GetNatureByName")]
        public async Task<ActionResult<NatureDTO>> GetNatureByName(string natureName)
        {
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int langId = _pokemonService.GetLangId(langs[0].Value.ToString());

            var nature = await _pokemonService.GetNatureByName(natureName, langId);
            if (nature == null)
            {
                return BadRequest("Nature not found.");
            }
            return Ok(nature);
        }

        [HttpGet("identifier/{natureIdentifier}", Name = "GetNatureByIdentifier")]
        public async Task<ActionResult<NatureDTO>> GetNatureByIdentifier(string natureIdentifier)
        {
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int langId = _pokemonService.GetLangId(langs[0].Value.ToString());

            var nature = await _pokemonService.GetNatureByIdentifier(natureIdentifier, langId);
            if (nature == null)
            {
                return BadRequest("Nature not found.");
            }
            return Ok(nature);
        }

        [HttpGet("all", Name = "GetAllNatures")]
        public async Task<ActionResult<List<NatureDTO>>> GetAllNatures()
        {
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int langId = _pokemonService.GetLangId(langs[0].Value.ToString());

            List<NatureDTO> naures = await _pokemonService.GetAllNatures(langId);
            if (naures == null)
            {
                return BadRequest("Natures not found.");
            }
            return Ok(naures);
        }

        [HttpGet, Route("query")]
        public async Task<ActionResult<List<TagDTO>>> QueryNaturesByName(string key)
        {
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int langId = _pokemonService.GetLangId(langs[0].Value.ToString());

            List<TagDTO> natures = _pokemonService.QueryNaturesByName(key, langId);
            if (natures == null)
            {
                return NotFound("Couldn't query natures");
            }
            return Ok(natures);
        }
    }
}
