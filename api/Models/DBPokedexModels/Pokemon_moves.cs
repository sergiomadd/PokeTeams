using Microsoft.EntityFrameworkCore;

namespace api.Models.DBPokedexModels
{
    [Keyless]
    public class Pokemon_moves
    {
        public int pokemon_id { get; set; }
        public int version_group_id { get; set; }
        public int move_id { get; set; }
    }
}
