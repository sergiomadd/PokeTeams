using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace api.Models.DBModels
{
    [PrimaryKey(nameof(pokemon_id), nameof(slot))]
    public class Pokemon_types
    {
        [Key]
        [Column(Order = 1)]
        public int pokemon_id { get; set; }
        public int type_id { get; set; }
        [Key]
        [Column(Order = 2)]
        public int slot { get; set; }
    }
}
