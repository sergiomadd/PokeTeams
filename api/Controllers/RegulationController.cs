using api.DTOs;
using api.Models.DBPoketeamModels;
using api.Services;
using api.Util;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegulationController : ControllerBase
    {
        private readonly IRegulationService _regulationService;

        public RegulationController(IRegulationService regulationService)
        {
            _regulationService = regulationService;
        }

        [HttpGet("all")]
        public async Task<ActionResult<List<RegulationDTO>>> GetAllRegulations()
        {
            List<RegulationDTO> regulationDTOs = await _regulationService.GetAllRegulations();
            if (regulationDTOs == null)
            {
                return NotFound("Couldn't find regulation");
            }
            return Ok(regulationDTOs);
        }

        [HttpGet("query/all")]
        public async Task<ActionResult<List<QueryResultDTO>>> QueryAllRegulations()
        {
            List<QueryResultDTO> results = await _regulationService.QueryAllRegulations();
            if (results == null)
            {
                return NotFound("Couldn't find regulation");
            }
            return Ok(results);
        }

        [HttpGet("{identifier}")]
        public async Task<ActionResult<RegulationDTO>> Get(string identifier)
        {
            RegulationDTO regulationDTO = await _regulationService.GetRegulationByIdentifier(identifier);
            if (regulationDTO == null)
            {
                return NotFound("Couldn't find regulation");
            }
            return Ok(regulationDTO);
        }

        [HttpPost]
        public async Task<ActionResult<object>> Post([FromBody] RegulationDTO regulationDTO)
        {
            Regulation newRegulation = await _regulationService.SaveRegulation(regulationDTO);
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
