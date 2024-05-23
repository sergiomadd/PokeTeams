using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models.DBPoketeamModels
{
    public class Tournament
    {
        public string Name { get; set; }
        [Key]
        public string NormalizedName { get; set; }
        public string? City { get; set; }
        public string? CountryCode { get; set; }
        public bool Official { get; set; }
        public string? RegulationIdentifier { get; set; } 
        public virtual Regulation? Regulation { get; set; }
        public DateOnly? Date { get; set; }
        public virtual ICollection<Team> Teams { get; set; }
    }
}
