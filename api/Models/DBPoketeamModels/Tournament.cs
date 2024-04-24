using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models.DBPoketeamModels
{
    public class Tournament
    {
        [Key]
        public string Name { get; set; }
        public bool Official { get; set; }
        public string RegulationName { get; set; }
        public virtual Regulation Regulation { get; set; }
        [DataType(DataType.Date)]
        public DateTime Date { get; set; }
    }
}
