namespace api.Services
{
    public interface IEmailService
    {
        public Task<bool> SendEmailAsync(string email, string subject, string message);
        public string GetConfirmEmailBodyHTML(string confirmationLink);
        public string GetResetPasswordBodyHTML(string resetLink);
    }
}
