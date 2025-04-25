using System.ComponentModel.DataAnnotations;

namespace api.Models.DBPokedexModels
{
    public class pokemon_form_types
    {
        [Key]
        public int pokemon_form_id { get; set; }
        public int type_id { get; set; }
        public int slot { get; set; }
    }
}
