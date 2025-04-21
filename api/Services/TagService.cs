using api.Data;
using api.DTOs;
using api.Models.DBPoketeamModels;
using api.Util;
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
        public async Task<Tag?> GetTag(string identifier)
        {
            Tag? tag = await _pokeTeamContext.Tag.FindAsync(identifier);
            if (tag != null)
            {
                return tag;
            }
            return null;
        }

        public async Task<List<TagDTO>> GetAllTags()
        {
            List<TagDTO> tagDTOs = new List<TagDTO>();

            var query =
                from tag in _pokeTeamContext.Tag

                select new TagDTO(
                    tag.Name,
                    tag.Identifier,
                    tag.Description,
                    tag.Color
                    );

            tagDTOs = await query.ToListAsync();

            return tagDTOs;
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

        public async Task<bool> TagAvailable(string tagName)
        {
            Tag? tag = await _pokeTeamContext.Tag.FirstOrDefaultAsync(t => t.Identifier == Formatter.NormalizeString(tagName));
            if (tag != null)
            {
                return false;
            }
            return true;
        }

        public async Task<List<QueryResultDTO>> QueryAllTags()
        {
            List<QueryResultDTO> queryResults = new List<QueryResultDTO>();

            var query =
                from tag in _pokeTeamContext.Tag

                select new QueryResultDTO(tag.Name, tag.Identifier, tag.Color, "tag");

            queryResults = await query.ToListAsync();

            return queryResults;
        }
    }
}
