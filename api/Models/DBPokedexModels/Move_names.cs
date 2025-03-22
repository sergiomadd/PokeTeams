using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace api.Models.DBModels
{
    public class Move_names
    {
        [Key]
        public int move_id { get; set; }
        public int local_language_id { get; set; }
        public string name { get; set; }
    }
}
