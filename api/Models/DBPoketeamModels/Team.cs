using System.ComponentModel.DataAnnotations;

namespace api.Models.DBPoketeamModels
{
    public class Team
    {
        [Key]
        public string Id { get; set; }
        public string Options { get; set; }
        public string? Uploaded { get; set; }
        public string? Designed { get; set; }
    }
}
