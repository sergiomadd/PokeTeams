using System.ComponentModel.DataAnnotations;
using static api.DTOs.PokemonDTOs.MoveDTO;

namespace api.Models.DBModels
{
    public class Move_meta
    {
        [Key]
        public int move_id { get; set; }
        public int? meta_ailment_id { get; set; }
        public int? min_hits { get; set; }
        public int? max_hits { get; set; }
        public int? min_turns { get; set; }
        public int? max_turns { get; set; }
        public int drain { get; set; }
        public int healing { get; set; }
        public int? crit_rate { get; set; }
        public int ailment_chance { get; set; }
        public int flinch_chance { get; set; }
        public int stat_chance { get; set; }
    }
}
