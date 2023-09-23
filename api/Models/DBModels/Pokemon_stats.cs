using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace api.Models.DBModels
{
    [PrimaryKey(nameof(pokemon_id), nameof(stat_id))]
    public class Pokemon_stats
    {
        [Key]
        [Column(Order = 1)]
        public int pokemon_id { get; set; }
        [Key]
        [Column(Order = 2)]
        public int stat_id { get; set; }
        public int base_stat { get; set; }

    }
}
