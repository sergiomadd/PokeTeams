using System.ComponentModel.DataAnnotations;

namespace api.Models.DBPoketeamModels
{
    public class Team
    {
        [Key]
        public string Id { get; set; }
        public string Options { get; set; }
        public string? Player { get; set; }
        public string? AnonPlayer { get; set;}
    }
}
