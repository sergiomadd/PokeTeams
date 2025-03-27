using api.DTOs;
using api.Models.DBPoketeamModels;

namespace api.Services
{
    public interface ITagService
    {
        public Task<Tag> GetTag(string identifier);
        public Task<List<TagDTO>> GetAllTags();
        public Task<bool> SaveTag(Tag tag);
        public bool TagAvailable(string tagName);
    }
}
