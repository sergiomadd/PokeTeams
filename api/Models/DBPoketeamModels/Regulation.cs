using System.ComponentModel.DataAnnotations;

namespace api.Models.DBPoketeamModels
{
    public class Regulation
    {
        public string Name { get; set; }
        [Key]
        public string Identifier { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public virtual ICollection<Tournament> Tournaments { get; set; }
    }
}
