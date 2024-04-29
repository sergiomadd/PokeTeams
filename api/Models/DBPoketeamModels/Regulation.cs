using System.ComponentModel.DataAnnotations;

namespace api.Models.DBPoketeamModels
{
    public class Regulation
    {
        public string Name { get; set; }
        [Key]
        public string Identifier { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public virtual ICollection<Tournament> Tournaments { get; set; }
    }
}
