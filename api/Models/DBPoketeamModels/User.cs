using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace api.Models.DBPoketeamModels
{
    public class User : IdentityUser
    {
        [StringLength(64)]
        public string? Name { get; set; }
        [StringLength(2)]
        public string? Country { get; set; }
        public string? Picture { get; set; }
        [DataType(DataType.Date)]
        public DateOnly DateCreated { get; set; } = DateOnly.FromDateTime(DateTime.Now);
        public bool Visibility { get; set; }
        public virtual ICollection<Team> Teams { get; set;}
    }
}
