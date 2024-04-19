namespace api.DTOs
{
    public class UserUpdateDTO
    {
        public string? CurrentUserName { get; set; }
        public string? NewUserName { get; set; }
        public string? CurrentEmail { get; set; }
        public string? NewEmail { get; set; }
        public string? CurrentPassword { get; set; }
        public string? NewPassword { get; set; }
        public string? NewPictureKey { get; set; }
        public string? NewCountryCode { get; set; }
        public string? NewName { get; set; }
        public bool? NewVisibility { get; set; }

    }
}
