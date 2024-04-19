namespace api.DTOs
{
    public class UserQueryDTO
    {
        public string UserName { get; set; }
        public string? Picture { get; set; }
        public CountryDTO? Country { get; set; }

    }
}
