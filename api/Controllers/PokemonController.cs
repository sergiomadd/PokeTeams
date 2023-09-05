using api.Data;
using api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PokemonController : ControllerBase
    {
        private readonly DataContext context;

        public PokemonController(DataContext dataContext)
        {
            context = dataContext;
        }

        public DataContext DataContext { get; }

        [HttpGet]
        public async Task<ActionResult<List<Pokemon>>> Get()
        {
            return Ok(await context.Pokemon.ToArrayAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Pokemon>> Get(int id)
        {
            var pokemon = await context.Pokemon.FindAsync(id);
            if(pokemon == null)
            {
                return BadRequest("Pokemon not found.");
            }
            return Ok(pokemon);
        }
    }
}
