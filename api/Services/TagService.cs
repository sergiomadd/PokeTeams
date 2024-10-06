using api.Data;
using api.DTOs;
using api.Models.DBPoketeamModels;
using api.Util;

namespace api.Services
{
    public class TagService : ITagService
    {
        private readonly PokeTeamContext _pokeTeamContext;
        public TagService(PokeTeamContext pokeTeamContext)
        {
            _pokeTeamContext = pokeTeamContext;
        }
        public async Task<Tag> GetTag(string identifier)
        {
            Tag tag = await _pokeTeamContext.Tag.FindAsync(identifier);
            if (tag == null)
            {
                return tag;
            }
            return null;
        }

        public async Task<bool> SaveTag(Tag tag)
        {
            try
            {
                await _pokeTeamContext.Tag.AddAsync(tag);
                await _pokeTeamContext.SaveChangesAsync();
            }
            catch (Exception e)
            {
                Printer.Log(e);
                return false;
            }
            return true;
        }

        public List<TagDTO> GetAllTags()
        {
            List<TagDTO> tagDTOs = new List<TagDTO>();
            List<Tag> tags = _pokeTeamContext.Tag.ToList();
            foreach (Tag tag in tags)
            {
                tagDTOs.Add(new TagDTO(
                    tag.Name, 
                    tag.Identifier, 
                    description: tag.Description,
                    color: tag.Color
                    ));
            }
            return tagDTOs;
        }

        public bool TagAvailable(string tagName)
        {
            Tag? tag = _pokeTeamContext.Tag.FirstOrDefault(t => t.Identifier == Formatter.NormalizeString(tagName));
            if (tag != null)
            {
                return false;
            }
            return true;
        }
    }
}
