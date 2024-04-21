using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models.DBPoketeamModels
{
    public class Pokemon
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string TeamId { get; set; }
        public virtual Team Team { get; set; }
        public int? DexNumber { get; set; }
        public string? Nickname { get; set; }
        public string? Type1Identifier { get; set; }
        public string? Type2Identifier { get; set; }
        public string? TeraTypeIdentifier { get; set; }
        public string? ItemIdentifier { get; set; }
        public string? AbilityIdentifier { get; set; }
        public string? NatureIdentifier { get; set; }
        public string? Move1Identifier { get; set; }
        public string? Move2Identifier { get; set; }
        public string? Move3Identifier { get; set; }
        public string? Move4Identifier { get; set; }
        public string? ivs { get; set; }
        public string? evs { get; set; }
        public int? Level { get; set; }
        public bool? Shiny { get; set; }
        public string? Gender { get; set; }
    }
}
