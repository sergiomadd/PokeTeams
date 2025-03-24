using api.Data;
using api.DTOs;
using api.Models.DBPoketeamModels;
using api.Util;
using Azure;
using Microsoft.EntityFrameworkCore;

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
            if (tag != null)
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

        public async Task<List<TagDTO>> GetAllTags()
        {
            List<TagDTO> tagDTOs = new List<TagDTO>();

            var query =
                from tag in _pokeTeamContext.Tag

                select new TagDTO(
                    tag.Name,
                    tag.Identifier,
                    null,
                    tag.Description,
                    tag.Color,
                    null
                    );

            tagDTOs = await query.ToListAsync();

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
