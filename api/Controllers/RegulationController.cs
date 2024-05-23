using api.DTOs;
using api.Models.DBPoketeamModels;
using api.Services.TeamService;
using api.Util;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegulationController : ControllerBase
    {
        private readonly IPokeTeamService _teamService;

        public RegulationController(IPokeTeamService teamService)
        {
            _teamService = teamService;
        }

        [HttpGet("all")]
        public ActionResult<List<RegulationDTO>> GetAllRegulations()
        {
            List<RegulationDTO> regulationDTOs = _teamService.GetAllRegulations();
            if (regulationDTOs == null)
            {
                return NotFound("Couldn't find regulation");
            }
            return Ok(regulationDTOs);
        }

        [HttpGet("{identifier}")]
        public async Task<ActionResult<RegulationDTO>> Get(string identifier)
        {
            RegulationDTO regulationDTO = await _teamService.GetRegulationByIdentifier(identifier);
            if (regulationDTO == null)
            {
                return NotFound("Couldn't find regulation");
            }
            return Ok(regulationDTO);
        }

        [HttpPost]
        public async Task<ActionResult<object>> Post([FromBody] RegulationDTO regulationDTO)
        {
            Regulation newRegulation = await _teamService.SaveRegulation(regulationDTO);
            if (newRegulation == null)
            {
                object response = new
                {
                    content = $"Failed to upload regulation."
                };
                return BadRequest(response);
            }
            else
            {
                object response = new
                {
                    content = newRegulation.Name
                };
                return Ok(response);
            }
        }
    }
}
