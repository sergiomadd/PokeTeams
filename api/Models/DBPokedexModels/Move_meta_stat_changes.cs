using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace api.Models.DBModels
{
    public class Move_meta_stat_changes
    {
        [Key]
        public int move_id { get; set; }
        public int stat_id { get; set; }
        public int change { get; set; }
    }
}
