using System.ComponentModel.DataAnnotations;

namespace api.Models.DBPokedexModels
{
    public class pokemon_form_names
    {
        [Key]
        public int pokemon_form_id { get; set; }
        public int local_language_id { get; set; }
        public string? form_name { get; set; }
        public string? pokemon_name { get; set; }
    }
}
