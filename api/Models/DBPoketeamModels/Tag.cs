using System.ComponentModel.DataAnnotations;

namespace api.Models.DBPoketeamModels
{
    public class Tag
    {
        [Key]
        public string Identifier { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Color { get; set; }
        public virtual ICollection<Team>? Teams { get; set; }
    }
}
