using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models.DBPoketeamModels
{
    public class Team
    {
        [Key]
        [StringLength(10, ErrorMessage = "Team id is not the correct length")]
        [Required(ErrorMessage = "Team id is required")]
        public string Id { get; set; }
        public virtual ICollection<Pokemon> Pokemons { get; set; }
        public string? Options { get; set; }
        [StringLength(450, ErrorMessage = "Team player id is not the correct length")]
        public string? PlayerId { get; set; }
        public virtual User? Player { get; set; }
        [StringLength(32, ErrorMessage = "Team player anon is too long")]
        public string? AnonPlayer { get; set;}
        [StringLength(256, ErrorMessage = "Team tournament name is too long")]
        public string? TournamentNormalizedName { get; set; }
        public virtual Tournament? Tournament { get; set; }
        public string? Regulation { get; set; }
        public virtual ICollection<Tag> Tags { get; set; }
        [StringLength(32, ErrorMessage = "Rental code is too long")]
        public string? RentalCode { get; set; }
        public int ViewCount { get; set; }
        [DataType(DataType.Date)]
        public DateTime DateCreated { get; set; }
        [Required(ErrorMessage = "Team visibility is required")]
        public bool Visibility { get; set; }

        public Team()
        {

        }

        public Team(
            string id, 
            ICollection<Pokemon> pokemons, 
            string? options,
            string? playerId,
            string? anonPlayer,
            string? tournamentNormalizedName,
            Tournament tournament,
            string? regulation,
            ICollection<Tag> tags,
            string? rentalCode,
            int viewCount,
            DateTime dateCreated,
            bool visibility
            )
        {
            Id = id;
            Pokemons = pokemons;
            Options = options;
            PlayerId = playerId;
            AnonPlayer = anonPlayer;
            TournamentNormalizedName = tournamentNormalizedName;
            Tournament = tournament;
            Regulation = regulation;
            Tags = tags;
            RentalCode = rentalCode;
            ViewCount = viewCount;
            DateCreated = dateCreated;
            Visibility = visibility;
        }
    }
}


