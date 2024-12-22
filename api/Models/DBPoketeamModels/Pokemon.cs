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

        [Range(1, 10000, ErrorMessage = "DesNumber is too long")]
        public int? DexNumber { get; set; }

        [MaxLength(16, ErrorMessage = "Nickname is too long")]
        public string? Nickname { get; set; }

        [MaxLength(128, ErrorMessage = "Type1Identifier is too long")]
        public string? Type1Identifier { get; set; }

        [MaxLength(128, ErrorMessage = "Type2Identifier is too long")]
        public string? Type2Identifier { get; set; }

        [MaxLength(128, ErrorMessage = "TeraTypeIdentifier is too long")]
        public string? TeraTypeIdentifier { get; set; }

        [MaxLength(128, ErrorMessage = "ItemIdentifier is too long")]
        public string? ItemIdentifier { get; set; }

        [MaxLength(128, ErrorMessage = "AbilityIdentifier is too long")]
        public string? AbilityIdentifier { get; set; }

        [MaxLength(128, ErrorMessage = "NatureIdentifier is too long")]
        public string? NatureIdentifier { get; set; }

        [MaxLength(128, ErrorMessage = "Move1Identifier is too long")]
        public string? Move1Identifier { get; set; }

        [MaxLength(128, ErrorMessage = "Move2Identifier aisre too long")]
        public string? Move2Identifier { get; set; }

        [MaxLength(128, ErrorMessage = "Move3Identifier is too long")]
        public string? Move3Identifier { get; set; }

        [MaxLength(128, ErrorMessage = "Move4Identifier is too long")]
        public string? Move4Identifier { get; set; }

        [MaxLength(2048, ErrorMessage = "IVs are too long")]
        public string? ivs { get; set; }

        [MaxLength(2048, ErrorMessage = "EVs are too long")]
        public string? evs { get; set; }

        [Range(1, 100, ErrorMessage = "Level is too long")]
        public int? Level { get; set; }

        public bool? Shiny { get; set; }

        public bool? Gender { get; set; }

        [StringLength(2048, ErrorMessage = "Notes are too long")]
        public string? Notes { get; set; }
    }
}
