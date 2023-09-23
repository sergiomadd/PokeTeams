using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models.DBModels
{
    [PrimaryKey(nameof(ability_id), nameof(local_language_id))]
    public class Ability_prose
    {
        [Key]
        [Column(Order = 1)]
        public int ability_id { get; set; }
        [Key]
        [Column(Order = 2)]
        public int? local_language_id { get; set; }
        public string? short_effect { get; set; }
        public string? effect { get; set; }
    }
}
