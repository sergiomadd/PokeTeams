using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace api.Models.DBPokedexModels
{
    public class abilities
    {
        [Key]
        public int id { get; set; }
        public string identifier { get; set; }
    }
}
