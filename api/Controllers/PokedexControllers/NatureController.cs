using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Models.DBModels;
using api.Services;
using api.Services.PokedexServices;
using api.Util;
using Microsoft.AspNetCore.Mvc;
using System.Xml.Linq;

namespace api.Controllers.PokedexControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NatureController : ControllerBase
    {
        private readonly INatureService _natureService;
        public NatureController(INatureService natureService)
        {
            _natureService = natureService;
        }

        [HttpGet("name/{natureName}")]
        public async Task<ActionResult<NatureDTO>> GetNatureByName(string natureName)
        {
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int? langId = Converter.GetLangIDFromCode(langs[0].Value.ToString());

            var nature = await _natureService.GetNatureByName(natureName, langId ?? 9);
            if (nature == null)
            {
                return BadRequest("Nature not found.");
            }
            return Ok(nature);
        }

        [HttpGet("identifier/{natureIdentifier}")]
        public async Task<ActionResult<NatureDTO>> GetNatureByIdentifier(string natureIdentifier)
        {
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int? langId = Converter.GetLangIDFromCode(langs[0].Value.ToString());

            var nature = await _natureService.GetNatureByIdentifier(natureIdentifier, langId ?? 9);
            if (nature == null)
            {
                return BadRequest("Nature not found.");
            }
            return Ok(nature);
        }

        [HttpGet("all")]
        public async Task<ActionResult<List<NatureDTO>>> GetAllNatures()
        {
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int? langId = Converter.GetLangIDFromCode(langs[0].Value.ToString());

            List<NatureDTO> naures = await _natureService.GetAllNatures(langId ?? 9);
            if (naures == null)
            {
                return BadRequest("Natures not found.");
            }
            return Ok(naures);
        }

        [HttpGet("query/all")]
        public async Task<ActionResult<List<QueryResultDTO>>> GetAllNaturesQuery()
        {
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int? langId = Converter.GetLangIDFromCode(langs[0].Value.ToString());

            List<QueryResultDTO> naures = await _natureService.QueryAllNatures(langId ?? 9);
            if (naures == null)
            {
                return BadRequest("Natures not found.");
            }
            return Ok(naures);
        }

        [HttpGet, Route("query")]
        public async Task<ActionResult<List<QueryResultDTO>>> QueryNaturesByName(string key)
        {
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int? langId = Converter.GetLangIDFromCode(langs[0].Value.ToString());

            List<QueryResultDTO> natures = await _natureService.QueryNaturesByName(key, langId ?? 9);
            if (natures == null)
            {
                return NotFound("Couldn't query natures");
            }
            return Ok(natures);
        }
    }
}
