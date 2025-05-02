using api.DTOs;
using api.Models.DBPoketeamModels;
using api.Services;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TagController : ControllerBase
    {
        private readonly ITagService _tagService;

        public TagController(ITagService tagService)
        {
            _tagService = tagService;
        }

        [HttpGet("{identifier}")]
        public async Task<ActionResult<Tag>> Get(string identifier)
        {
            Tag? tag = await _tagService.GetTag(identifier);
            if (tag == null)
            {
                return BadRequest("Tag not found.");
            }
            return Ok(tag);
        }

        [HttpPost]
        public async Task<ActionResult<Tag>> Post(Tag tag)
        {
            bool saved = await _tagService.SaveTag(tag);
            if (!saved)
            {
                return BadRequest("Tag not saved.");
            }
            return Ok();
        }

        [HttpGet("all")]
        public async Task<ActionResult<List<TagDTO>>> GetAllRegulations()
        {
            List<TagDTO> tagDTOs = await _tagService.GetAllTags();
            if (tagDTOs == null)
            {
                return NotFound("Couldn't get all tags");
            }
            return Ok(tagDTOs);
        }

        [HttpGet, Route("check/{tagName}")]
        public async Task<ActionResult<bool>> TagAvailable(string tagName)
        {
            bool available = await _tagService.TagAvailable(tagName);
            if (!available)
            {
                return Ok(false);
            }
            return Ok(true);
        }

        [HttpGet("query/all")]
        public async Task<ActionResult<List<QueryResultDTO>>> QueryAllTags()
        {
            List<QueryResultDTO> results = await _tagService.QueryAllTags();
            if (results == null)
            {
                return NotFound("Couldn't find tags");
            }
            return Ok(results);
        }
    }
}
