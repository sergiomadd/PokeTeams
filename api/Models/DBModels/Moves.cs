using System.ComponentModel.DataAnnotations;

namespace api.Models.DBModels
{
    public class Moves
    {
        [Key]
        public int id { get; set; }
        public string? identifier { get; set; }
        public int? type_id { get; set; }
        public int? power { get; set; }
        public int? pp { get; set; }
        public int? accuracy { get; set; }
        public int? priority { get; set; }
        public int? target_id { get; set; }
        public int? damage_class_id { get; set; }
        public int? effect_id { get; set; }
        public int? effect_chance { get; set; }
    }
}
