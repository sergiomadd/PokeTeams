using api.Models.DBPoketeamModels.Pokemon;
using api.Services.PokedexService;
using api.Services.TeamService;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EditorController : ControllerBase
    {
        private readonly IPokeTeamService _teamService;
        public EditorController(IPokeTeamService teamService)
        {
            _teamService = teamService;
        }
        
        [HttpGet(Name = "GetEditorOptionsData")]
        public async Task<ActionResult<EditorData>> GetEditorOptionsData()
        {
            var editorData = await _teamService.GetEditorData();
            if (editorData == null)
            {
                return BadRequest("Editor Data not found.");
            }
            return Ok(editorData);
        }
        
    }
}
