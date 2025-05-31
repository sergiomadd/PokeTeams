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

        [Required]
        [Range(1, 10000, ErrorMessage = "DexNumber is too long")]
        public int DexNumber { get; set; }

        //Formid here is pokemonid from pokemons with multiple same dexnumber rows
        [Range(1, 10000, ErrorMessage = "FormId is too long")]
        public int? FormId { get; set; }

        [MaxLength(16, ErrorMessage = "Nickname is too long")]
        public string? Nickname { get; set; }

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

        [Range(1, 100, ErrorMessage = "Level is too long")]
        public int? Level { get; set; }

        public bool? Shiny { get; set; }

        public bool? Gender { get; set; }

        [StringLength(2048, ErrorMessage = "Notes are too long")]
        public string? Notes { get; set; }

        [Range(0, 31, ErrorMessage = "IV_hp is too long")]
        public int? IV_hp { get; set; }

        [Range(0, 31, ErrorMessage = "IV_atk is too long")]
        public int? IV_atk { get; set; }

        [Range(0, 31, ErrorMessage = "IV_def is too long")]
        public int? IV_def { get; set; }

        [Range(0, 31, ErrorMessage = "IV_spa is too long")]
        public int? IV_spa { get; set; }

        [Range(0, 31, ErrorMessage = "IV_spd is too long")]
        public int? IV_spd { get; set; }

        [Range(0, 31, ErrorMessage = "IV_spe is too long")]
        public int? IV_spe { get; set; }

        [Range(0, 252, ErrorMessage = "EV_hp is too long")]
        public int? EV_hp { get; set; }

        [Range(0, 252, ErrorMessage = "EV_atk is too long")]
        public int? EV_atk { get; set; }

        [Range(0, 252, ErrorMessage = "EV_def is too long")]
        public int? EV_def { get; set; }

        [Range(0, 252, ErrorMessage = "EV_spa is too long")]
        public int? EV_spa { get; set; }

        [Range(0, 252, ErrorMessage = "EV_spd is too long")]
        public int? EV_spd { get; set; }

        [Range(0, 252, ErrorMessage = "EV_spe is too long")]
        public int? EV_spe { get; set; }
    }
}
