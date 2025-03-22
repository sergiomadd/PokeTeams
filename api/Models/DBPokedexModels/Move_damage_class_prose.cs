using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace api.Models.DBModels
{
    public class Move_damage_class_prose
    {
        [Key]
        public int move_damage_class_id { get; set; }
        public int local_language_id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
    }
}
