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
        public virtual ICollection<TeamPokemon> Pokemons { get; set; }

        [StringLength(32, ErrorMessage = "Team player is too long")]
        public string? Player { get; set; }

        [StringLength(450, ErrorMessage = "Team user is not the correct length")]
        public string? UserId { get; set; }
        public virtual User? User { get; set; }

        [StringLength(128, ErrorMessage = "Team title is too long")]
        public string? Title { get; set; }

        [StringLength(256, ErrorMessage = "Team tournament name is too long")]
        public string? TournamentNormalizedName { get; set; }
        public virtual Tournament? Tournament { get; set; }
        public string? Regulation { get; set; }
        public ICollection<string>? TagIds { get; set; }

        [StringLength(32, ErrorMessage = "Rental code is too long")]
        public string? RentalCode { get; set; }
        public int ViewCount { get; set; }

        [DataType(DataType.Date)]
        public DateTime DateCreated { get; set; }

        [Required(ErrorMessage = "Team visibility is required")]
        public bool Visibility { get; set; }
        public bool IVsVisibility { get; set; }
        public bool EVsVisibility { get; set; }
        public bool NaturesVisibility { get; set; }

        public Team()
        {

        }

        public Team(
            string id,
            ICollection<TeamPokemon> pokemons,
            string? player,
            string? userId,
            string? title,
            string? tournamentNormalizedName,
            Tournament tournament,
            string? regulation,
            ICollection<string> tags,
            string? rentalCode,
            int viewCount,
            DateTime dateCreated,
            bool visibility,
            bool ivsVisibilty = false,
            bool evsVisibilty = false,
            bool naturesVisibilty = false
            )
        {
            Id = id;
            Pokemons = pokemons;
            Player = player;
            UserId = userId;
            Title = title;
            TournamentNormalizedName = tournamentNormalizedName;
            Tournament = tournament;
            Regulation = regulation;
            TagIds = tags;
            RentalCode = rentalCode;
            ViewCount = viewCount;
            DateCreated = dateCreated;
            Visibility = visibility;
            IVsVisibility = ivsVisibilty;
            EVsVisibility = evsVisibilty;
            NaturesVisibility = naturesVisibilty;
        }
    }
}


