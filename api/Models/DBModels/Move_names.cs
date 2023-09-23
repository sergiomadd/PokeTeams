using System.ComponentModel.DataAnnotations;

namespace api.Models.DBModels
{
    public class Move_names
    {
        public int move_id { get; set; }
        public int local_language_id { get; set; }
        [Key]
        public string name { get; set; }
    }
}
