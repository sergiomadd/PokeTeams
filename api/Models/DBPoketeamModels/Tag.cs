using System.ComponentModel.DataAnnotations;

namespace api.Models.DBPoketeamModels
{
    public class Tag
    {
        [Key]
        [Required(ErrorMessage = "Tag identifier is required")]
        [StringLength(16, ErrorMessage = "Tag identifier is too long")]
        public string Identifier { get; set; }

        [Required(ErrorMessage = "Tag name is required")]
        [StringLength(16, ErrorMessage = "Tag name is too long")]
        public string Name { get; set; }

        [StringLength(256, ErrorMessage = "Tag description is too long")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Tag color is required")]
        [StringLength(8, ErrorMessage = "Tag color is too long")]
        public string Color { get; set; }

        public virtual ICollection<Team>? Teams { get; set; }
    }
}
