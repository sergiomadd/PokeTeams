using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace api.Models.DBModels
{
    [PrimaryKey(nameof(move_target_id), nameof(local_language_id))]

    public class Move_target_prose
    {
        [Key]
        [Column(Order = 1)]
        public int move_target_id { get; set; }
        [Key]
        [Column(Order = 2)]
        public int? local_language_id { get; set; }
        public string? name { get; set; }
        public string? description { get; set; }
    }
}
