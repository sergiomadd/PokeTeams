using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace api.Models.DBPoketeamModels
{
    public class User : IdentityUser
    {
        [StringLength(32, ErrorMessage = "Name is too long")]
        public string? Name { get; set; }

        [StringLength(2, ErrorMessage = "User country is too long")]
        public string? Country { get; set; }

        [StringLength(32, ErrorMessage = "Picture is too long")]
        public string? Picture { get; set; }

        [DataType(DataType.Date)]
        public DateOnly DateCreated { get; set; } = DateOnly.FromDateTime(DateTime.Now);

        public bool Visibility { get; set; }

        public virtual ICollection<Team> Teams { get; set;}
        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }

        [Timestamp]
        public byte[]? RowVersion { get; set; }
    }
}
