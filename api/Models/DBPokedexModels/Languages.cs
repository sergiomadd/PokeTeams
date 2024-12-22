using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace api.Models.DBPokedexModels
{
    [Keyless]
    public class Languages
    {
        public int id { get; set; }
        public string identifier { get; set; }
    }
}
