using System.ComponentModel.DataAnnotations;

namespace api.Models.DBPoketeamModels
{
    public class Team
    {
        [Key]
        public string Id { get; set; }
        public string? Options { get; set; }
        public string? Player { get; set; }
        public string? AnonPlayer { get; set;}
        public string? Tournament { get; set; }
        public string? Regulation { get; set; }
        public int ViewCount { get; set; }
        public string? DateAdded { get; set; }
    }
}
