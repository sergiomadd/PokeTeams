using api.Models.DBPoketeamModels;
using System.ComponentModel.DataAnnotations;

namespace api.DTOs
{
    public class TournamentDTO
    {
        public string Name { get; set; }
        public string? City { get; set; }
        public string? CountryCode { get; set; }
        public bool Official { get; set; }
        public RegulationDTO? Regulation { get; set; }
        public DateOnly? Date { get; set; }
    }
}
