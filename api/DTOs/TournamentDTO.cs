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
        public string? Category { get; set; }
        public DateOnly? StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
    }
}
