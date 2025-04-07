using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace api.Models.DBPokedexModels
{
    [Keyless]
    public class languages
    {
        public int id { get; set; }
        public string identifier { get; set; }
    }
}
