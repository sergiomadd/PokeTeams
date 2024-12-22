using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace api.Models.DBModels
{
    [Keyless]
    public class Move_meta_stat_changes
    {
        public int move_id { get; set; }
        public int stat_id { get; set; }
        public int change { get; set; }
    }
}
