using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models.DBPoketeamModels
{
    public class Team
    {
        [Key]
        [StringLength(10)]
        public string Id { get; set; }
        public string Pokemons { get; set; }
        public string? Options { get; set; }
        public virtual User? Player { get; set; }
        [StringLength(450)]
        public string? PlayerId { get; set; }
        [StringLength(64)]
        public string? AnonPlayer { get; set;}
        public string? Tournament { get; set; }
        public string? Regulation { get; set; }
        public int ViewCount { get; set; }
        [DataType(DataType.Date)]
        public DateTime DateCreated { get; set; } = DateTime.Today;
        public bool Visibility { get; set; }
    }
}
