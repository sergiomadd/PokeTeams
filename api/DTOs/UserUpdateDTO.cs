using System.ComponentModel.DataAnnotations;

namespace api.DTOs
{
    public class UserUpdateDTO
    {
        [StringLength(32, ErrorMessage = "The new username must be shorter than 32 characters")]
        public string? NewUserName { get; set; }

        [StringLength(256, ErrorMessage = "The new email must be shorter than 32 characters")]
        public string? NewEmail { get; set; }

        public string? EmailConfirmationCode { get; set; }

        [StringLength(256, ErrorMessage = "The current password must be shorter than 256 characters")]
        public string? CurrentPassword { get; set; }

        [StringLength(256, ErrorMessage = "The new password must be shorter than 256 characters")]
        public string? NewPassword { get; set; }

        [StringLength(32, ErrorMessage = "The new picture must be shorter than 32 characters")]
        public string? NewPictureKey { get; set; }

        [StringLength(2, ErrorMessage = "The new country code must be shorter than 3 characters")]
        public string? NewCountryCode { get; set; }

        [StringLength(32, ErrorMessage = "The new name must be shorter than 32 characters")]
        public string? NewName { get; set; }

        public bool? NewVisibility { get; set; }
    }
}
