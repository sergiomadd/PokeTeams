using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models.DBPoketeamModels
{
    public class Tournament
    {
        [Key]
        public string Name { get; set; }
        public string NormalizedName { get; set; }
        public string City { get; set; }
        public string CountryCode { get; set; }
        public bool Official { get; set; }
        public string RegulationIdentifier { get; set; }
        [DataType(DataType.Date)]
        public DateTime Date { get; set; }
    }
}
