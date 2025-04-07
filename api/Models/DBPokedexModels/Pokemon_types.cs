using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace api.Models.DBModels
{
    [Keyless]
    public class pokemon_types

    {
        public int pokemon_id { get; set; }
        public int type_id { get; set; }
        public int slot { get; set; }
    }
}
