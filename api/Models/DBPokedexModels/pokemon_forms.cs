using System.ComponentModel.DataAnnotations;

namespace api.Models.DBPokedexModels
{
    public class pokemon_forms
    {
        [Key]
        public int id { get; set; }
        public string identifier { get; set; }
        public string? form_identifier { get; set; }
        public int pokemon_id { get; set; }
        public int form_order { get; set; }
        public int order { get; set; }
    }
}
