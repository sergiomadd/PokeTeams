using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace api.Models.DBModels
{
    [Keyless]
    public class Type_efficacy
    {
        public int damage_type_id { get; set; }
        public int target_type_id { get; set; }
        public int damage_factor { get; set; }
    }
}
