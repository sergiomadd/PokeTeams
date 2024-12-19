using System.ComponentModel.DataAnnotations;

namespace api.Models.DBPokedexModels
{
    public class Languages
    {
        [Key]
        public int id { get; set; }
        public string identifier { get; set; }
    }
}
