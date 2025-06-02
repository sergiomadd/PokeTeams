using Microsoft.AspNetCore.Mvc;
using api.Models.DBPoketeamModels;
using api.Util;
using api.DTOs;
using api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using api.Middlewares;
using Microsoft.AspNetCore.RateLimiting;
using System.Text.Json;
using api.Services.PokedexServices;


namespace api.Controllers
{
#if DEBUG
    [Route("api/[controller]")]
    [ApiController]
    public class TestDataController : ControllerBase
    {
        public TestDataController()
        {

        }

        [HttpGet, Route("paste/{key}")]
        public IActionResult GetTestPaste(string key)
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "Data", "Util", "test_pastes.json");

            if (!System.IO.File.Exists(path))
            {
                return NotFound();
            }

            var json = System.IO.File.ReadAllText(path);
            JsonElement data = JsonSerializer.Deserialize<JsonElement>(json);
            return Ok(data.GetProperty(key).GetString());
        }

        [HttpGet, Route("forms")]
        public IActionResult GetAllForms()
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "Data", "Util", "pokemon_namesEN_with_forms.json");

            if (!System.IO.File.Exists(path))
            {
                return NotFound();
            }

            var json = System.IO.File.ReadAllText(path);
            List<string>? data = JsonSerializer.Deserialize<List<string>>(json);
            if (data == null)
            {
                return BadRequest("Error loading data");
            }
            string stringbuffer = "";
            foreach (string name in data)
            {
                stringbuffer += name + "\n\n";
            }
            return Ok(stringbuffer);
        }
    }
#endif
}
