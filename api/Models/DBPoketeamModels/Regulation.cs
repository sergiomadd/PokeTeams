using System.ComponentModel.DataAnnotations;

namespace api.Models.DBPoketeamModels
{
    public class Regulation
    {
        [Required(ErrorMessage = "Regulation name is required")]
        [StringLength(32, ErrorMessage = "Regulation is too long")]
        public string Name { get; set; }

        [Key]
        [Required(ErrorMessage = "Regulation identifier is required")]
        [StringLength(2, ErrorMessage = "Regulation identifier is too long")]
        public string Identifier { get; set; }

        public DateOnly? StartDate { get; set; }

        public DateOnly? EndDate { get; set; }

        public Regulation()
        {

        }
    }
}
