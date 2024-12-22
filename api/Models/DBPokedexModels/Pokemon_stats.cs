using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace api.Models.DBModels
{
    [Keyless]
    public class Pokemon_stats
    {
        public int pokemon_id { get; set; }
        public int stat_id { get; set; }
        public int base_stat { get; set; }

    }
}
