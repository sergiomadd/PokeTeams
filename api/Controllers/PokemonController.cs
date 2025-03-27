using api.Data;
using api.DTOs;
using api.DTOs.PokemonDTOs;
using api.Models;
using api.Models.DBModels;
using api.Services;
using api.Services.PokedexServices;
using api.Util;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PokemonController : ControllerBase
    {
        private readonly IPokemonService _pokemonService;
        private readonly IIdentityService _identityService;

        public PokemonController(IPokemonService pokemonService, IIdentityService identityService)
        {
            _pokemonService = pokemonService;
            _identityService = identityService;
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [AllowAnonymous]
        [HttpGet("{pokemonId}")]
        public async Task<ActionResult<PokemonDTO>> GetPokemonById(int pokemonId)
        {
            if (_identityService.CheckForRefresh(Request))
            {
                return Unauthorized("NoAccessTokenProvided");
            }
            else
            {
                var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
                int? langId = Converter.GetLangIDFromCode(langs[0].Value.ToString());

                var pokemonDTO = await _pokemonService.GetPokemonById(pokemonId, langId ?? 9);

                if (pokemonDTO == null)
                {
                    return NotFound("Pokemon not found.");
                }
                return Ok(pokemonDTO);
            }
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [AllowAnonymous]
        [HttpGet("nolang/{pokemonId}")]
        public async Task<ActionResult<PokemonDTO>> GetPokemonByIdNoLang(int pokemonId)
        {
            if (_identityService.CheckForRefresh(Request))
            {
                return Unauthorized("NoAccessTokenProvided");
            }
            else
            {
                var pokemonDTO = await _pokemonService.GetPokemonById(pokemonId, (int)Lang.en);

                if (pokemonDTO == null)
                {
                    return NotFound("Pokemon not found.");
                }
                return Ok(pokemonDTO);
            }
        }

        [HttpGet("name/{pokemonName}", Name = "GetPokemonDataByName")]
        public async Task<ActionResult<PokemonDataDTO>> GetPokemonDataByName(string pokemonName) 
        {
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int? langId = Converter.GetLangIDFromCode(langs[0].Value.ToString());

            var pokemon = await _pokemonService.GetPokemonDataByName(pokemonName, langId ?? 9);
            if(pokemon == null)
            {
                return NotFound("Pokemon not found.");
            }
            return Ok(pokemon);
        }

        [HttpGet("pokemon-previews/{teamId}")]
        public async Task<ActionResult<List<PokemonPreviewDTO>>> GetTeamPokemonPreviews(string teamId)
        {
            if (teamId == null)
            {
                return BadRequest("Team id is null");
            }

            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int? langId = Converter.GetLangIDFromCode(langs[0].Value.ToString());

            var pokemonDTO = await _pokemonService.GetTeamPokemonPreviews(teamId, langId ?? 9);

            if (pokemonDTO == null)
            {
                return NotFound("Pokemon not found.");
            }
            return Ok(pokemonDTO);
        }

        [HttpGet, Route("query")]
        public async Task<ActionResult<List<QueryResultDTO>>> QueryPokemonsByName(string key)
        {
            var langs = HttpContext.Request.GetTypedHeaders().AcceptLanguage.OrderByDescending(x => x.Quality ?? 1).ToList();
            int? langId = Converter.GetLangIDFromCode(langs[0].Value.ToString());

            List<QueryResultDTO> pokemons = await _pokemonService.QueryPokemonsByName(key, langId ?? 9);
            if (pokemons == null)
            {
                return NotFound("Couldn't find pokemons");
            }
            return Ok(pokemons);
        }
    }
}
