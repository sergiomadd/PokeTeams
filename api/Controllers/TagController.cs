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
            Tag tag = await _tagService.GetTag(identifier);
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
    }
}
