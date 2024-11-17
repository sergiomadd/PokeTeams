using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using api.Util;
using Microsoft.AspNetCore.Authorization;
using api.Models.DBPoketeamModels;
using System.Text.Json;
using api.DTOs;
using api.Services;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IPokeTeamService _pokeTeamService;
        private readonly IUserService _userService;

        public UserController(UserManager<User> userManager,
            SignInManager<User> signInManager,
            IPokeTeamService teamService,
            IUserService userService,
            TokenGenerator tokenGenerator
            )
        {
            _pokeTeamService = teamService;
            _userService = userService;
        }

        [HttpGet, Route("{userName}")]
        public async Task<ActionResult<UserDTO>> GetUserByUserName(string userName)
        {
            User user = await _userService.GetUserByUserName(userName);
            if (user == null)
            {
                return NotFound("Couldn't find user");
            }
            if (!user.Visibility)
            {
                return Unauthorized("User is private");
            }
            UserDTO userDTO = await _userService.BuildUserDTO(user);
            return Ok(userDTO);
        }

        [HttpGet, Route("query")]
        public async Task<ActionResult<List<UserQueryDTO>>> QueryUsers(string key)
        {
            List<UserQueryDTO> users = await _userService.QueryUsers(key);
            if (users == null)
            {
                return NotFound("Couldn't find user");
            }
            return Ok(users);
        }

        [HttpGet, Route("chunkquery")]
        public async Task<ActionResult<List<UserQueryDTO>>> ChunkQueryUsers(string key, int startIndex, int pageSize)
        {
            List<UserQueryDTO> users = await _userService.ChunkQueryUsers(key, startIndex, pageSize);
            users.Skip(startIndex).Take(pageSize);
            if (users == null)
            {
                return NotFound("Couldn't find user");
            }
            return Ok(users);
        }

        [HttpGet, Route("countries/{code}")]
        public ActionResult<CountryDTO> GetCountry(string code)
        {
            CountryDTO country = _userService.GetCountry(code);
            if (country == null)
            {
                return BadRequest();
            }
            return Ok(country);
        }

        [HttpGet, Route("countries")]
        public ActionResult<List<CountryDTO>> GetCountries()
        {
            List<CountryDTO> countries = new List<CountryDTO>();
            using (StreamReader r = new StreamReader("wwwroot/data/countries.json"))
            {
                string json = r.ReadToEnd();
                countries = JsonSerializer.Deserialize<List<CountryDTO>>(json);
                foreach (var country in countries)
                {
                    country.Icon = $"https://localhost:7134/images/sprites/flags/{country.code}.svg";
                }
            }
            return Ok(countries);
        }

        [HttpGet, Route("pictures")]
        public async Task<ActionResult<List<string>>> GetPictures()
        {
            //full path "https://localhost:7134/images/sprites/profile-pics/blastoise.jpeg",
            List<string> keys = new List<string>
            {
                "bulbasaur",
                "charmander",
                "squirtle",
                "pikachu",
                "gengar",
                "dragonite",
                "snorlax",
                "mewtwo",
            };
            List<string> pictures = new List<string>();

            foreach (var key in keys)
            {
                pictures.Add($"https://localhost:7134/images/sprites/profile-pics/{key}.png");
            }
            return pictures;
        }
    }
}
