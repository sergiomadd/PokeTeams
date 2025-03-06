using api.DTOs;
using api.Util;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models.DBPoketeamModels
{
    public class Tournament
    {
        [Key]
        [Required(ErrorMessage = "Tournament normalized name is required")]
        [StringLength(256, ErrorMessage = "Tournament normalized name is too long")]
        public string NormalizedName { get; set; }

        [Required(ErrorMessage = "Tournament name is required")]
        [StringLength(256, ErrorMessage = "Tournament name is too long")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Tournament short name is required")]
        [StringLength(256, ErrorMessage = "Tournament short name is too long")]
        public string ShortName { get; set; }

        [StringLength(32, ErrorMessage = "Tournament cityu is too long")]
        public string? City { get; set; }

        [StringLength(2, ErrorMessage = "Tournament country code is too long")]
        public string? CountryCode { get; set; }

        [Required(ErrorMessage = "Tournament official is required")]
        public bool Official { get; set; }

        [StringLength(32, ErrorMessage = "Tournament category is too long")]
        public string? Category { get; set; }

        public DateOnly? StartDate { get; set; }
        public DateOnly? EndDate { get; set; }

        public virtual ICollection<Team>? Teams { get; set; }


        public Tournament()
        {

        }

        public Tournament(TournamentDTO tournamentDTO)
        {
            Name = tournamentDTO.Name;
            NormalizedName = Formatter.NormalizeString(tournamentDTO.Name);
            City = tournamentDTO.City;
            CountryCode = tournamentDTO.CountryCode;
            Official = tournamentDTO.Official;
            Category = tournamentDTO.Category;
            StartDate = tournamentDTO.StartDate;
            EndDate = tournamentDTO.EndDate;
        }
    }
}
