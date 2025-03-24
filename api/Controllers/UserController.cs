using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using api.Util;
using Microsoft.AspNetCore.Authorization;
using api.Models.DBPoketeamModels;
using api.DTOs;
using api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IPokeTeamService _pokeTeamService;
        private readonly IUserService _userService;
        private readonly IIdentityService _identityService;

        public UserController(UserManager<User> userManager,
            IPokeTeamService teamService,
            IUserService userService,
            IIdentityService identityService
            )
        {
            _userManager = userManager;
            _pokeTeamService = teamService;
            _userService = userService;
            _identityService = identityService;
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [AllowAnonymous]
        [HttpGet, Route("{userName}")]
        public async Task<ActionResult<UserDTO>> GetUserByUserName(string userName)
        {
            if (_identityService.CheckForRefresh(Request))
            {
                return Unauthorized("NoAccessTokenProvided");
            }
            else
            {
                User user = await _userService.GetUserByUserName(userName);
                if (user == null)
                {
                    return NotFound("Couldn't find user");
                }
                UserDTO userDTO = await _userService.BuildUserDTO(user, User.Identity.Name != null ? User.Identity.Name == user.UserName : false);
                return Ok(userDTO);
            }
        }

        [HttpGet, Route("check/username/{userName}")]
        public async Task<ActionResult> UserNameAvailable(string userName)
        {
            Printer.Log($"Checking availability of {userName}");
            bool available = await _userService.UserNameAvailable(userName);
            if (!available)
            {
                return BadRequest("Username already taken.");
            }
            return Ok();
        }

        [HttpGet, Route("check/email/{email}")]
        public async Task<ActionResult> EmailAvailable(string email)
        {
            User? user = await _userManager.FindByEmailAsync(email);
            if (user != null)
            {
                return BadRequest("Email already taken.");
            }
            return Ok();
        }

        [HttpGet, Route("query")]
        public async Task<ActionResult<List<QueryResultDTO>>> QueryUsers(string key)
        {
            List<QueryResultDTO> users = await _userService.QueryUsers(key);
            if (users == null)
            {
                return NotFound("Couldn't find user");
            }
            return Ok(users);
        }

        [HttpGet, Route("chunkquery")]
        public async Task<ActionResult<List<QueryResultDTO>>> ChunkQueryUsers(string key, int startIndex, int pageSize)
        {
            List<QueryResultDTO> users = await _userService.ChunkQueryUsers(key, startIndex, pageSize);
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

        [HttpGet, Route("countries/all")]
        public async Task<ActionResult<List<QueryResultDTO>>> QueryAllCountries()
        {
            List<QueryResultDTO> countries = await _userService.QueryAllCountries();
            if (countries == null)
            {
                return NotFound("Couldn't query all countries");
            }
            return Ok(countries);
        }

        [HttpGet, Route("countries/query")]
        public async Task<ActionResult<List<QueryResultDTO>>> QueryCountriesByName(string key)
        {
            List<QueryResultDTO> countries = await _userService.QueryCountriesByName(key);
            if (countries == null)
            {
                return NotFound("Couldn't query countries");
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
        //Keep incase countries change
        /*
        [HttpPost, Route("country/add")]
        public async Task<ActionResult<object>> AddCountry([FromBody] CountryDTOB countryDTOB)
        {
            bool added = await _userService.AddCountry(countryDTOB);
            if (added)
            {
                return Ok();
            }
            return BadRequest();
        }
        

        [HttpGet, Route("country/process")]
        public async Task<ActionResult<object>> Process()
        {
            List<CountryDTOC> countries = new List<CountryDTOC>();
            using (StreamReader r = new StreamReader("wwwroot/data/countriesnew.json"))
            {
                string json = r.ReadToEnd();
                countries = JsonSerializer.Deserialize<List<CountryDTOC>>(json);
                foreach (var country in countries)
                {
                    if (country != null)
                    {
                        string normalizedName = country.country.ToLower().Replace(" ", "-");
                        CountryDTOB countryDTOB = new CountryDTOB
                        {
                            NormalizedName = normalizedName,
                            Name = country.country,
                            Code = country.abbreviation.ToLower()
                        };
                        bool added = await _userService.AddCountry(countryDTOB);
                        if (!added)
                        {
                            return BadRequest();
                        }
                    }
                    else
                    {
                        return BadRequest(country.country);
                    }

                }
            }
            return Ok();
        }
        */
    }
}
