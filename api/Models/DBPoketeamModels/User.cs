using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace api.Models.DBPoketeamModels
{
    public class User : IdentityUser
    {
        [PersonalData]
        public string? Name { get; set; }
        [PersonalData]
        public string? Country { get; set; }
        public string? Picture { get; set; }
        [PersonalData]
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;
        public bool Visibility { get; set; }
    }
}
