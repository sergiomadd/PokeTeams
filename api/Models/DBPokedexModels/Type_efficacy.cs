using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace api.Models.DBModels
{
    [PrimaryKey(nameof(damage_type_id), nameof(target_type_id))]
    public class Type_efficacy
    {
        [Key]
        [Column(Order = 1)]
        public int damage_type_id { get; set; }
        [Key]
        [Column(Order = 2)]
        public int target_type_id { get; set; }
        public int damage_factor { get; set; }
    }
}
