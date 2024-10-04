using api.DTOs;
using api.Util;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models.DBPoketeamModels
{
    public class Tournament
    {
        [Required(ErrorMessage = "Tournament name is required")]
        [StringLength(256, ErrorMessage = "Tournament name is too long")]
        public string Name { get; set; }

        [Key]
        [Required(ErrorMessage = "Tournament normalized name is required")]
        [StringLength(256, ErrorMessage = "Tournament normalized name is too long")]
        public string NormalizedName { get; set; }

        [StringLength(32, ErrorMessage = "Tournament cityu is too long")]
        public string? City { get; set; }

        [StringLength(2, ErrorMessage = "Tournament country code is too long")]
        public string? CountryCode { get; set; }

        [Required(ErrorMessage = "Tournament official is required")]
        public bool Official { get; set; }

        public string? RegulationIdentifier { get; set; } 

        public virtual Regulation? Regulation { get; set; }

        public DateOnly? Date { get; set; }

        public virtual ICollection<Team> Teams { get; set; }


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
            RegulationIdentifier = tournamentDTO.Regulation != null ? tournamentDTO.Regulation.Identifier : null;
            Date = tournamentDTO.Date;
        }
    }
}
