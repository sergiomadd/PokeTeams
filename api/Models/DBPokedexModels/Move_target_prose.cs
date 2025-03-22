using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace api.Models.DBModels
{
    public class Move_target_prose
    {
        [Key]
        public int move_target_id { get; set; }
        public int local_language_id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
    }
}
