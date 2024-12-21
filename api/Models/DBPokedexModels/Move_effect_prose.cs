using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace api.Models.DBModels
{
    [PrimaryKey(nameof(move_effect_id), nameof(local_language_id))]

    public class Move_effect_prose
    {
        [Key]
        [Column(Order = 1)]
        public int move_effect_id { get; set; }
        [Key]
        [Column(Order = 2)]
        public int local_language_id { get; set; }
        public string short_effect { get; set; }
        public string effect { get; set; }
    }
}
