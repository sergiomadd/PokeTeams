using System.ComponentModel.DataAnnotations;

namespace api.Models.DBPoketeamModels
{
    public class Regulation
    {
        [Key]
        public string Name { get; set; }
        public string Identifier { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
    }
}
