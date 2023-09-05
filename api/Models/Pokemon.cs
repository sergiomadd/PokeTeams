using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class Pokemon
    {
        [Key]
        public int Id { get; set; }
        public string Identifier { get; set; }
        public int Species_id { get; set; }
        public int Height { get; set; }
        public int Weight { get; set; }
        public int Base_experience { get; set; }
        public int Order { get; set; }
        public int Is_default { get; set; }
    }
}
