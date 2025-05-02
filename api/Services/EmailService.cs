using api.Util;
using System.Net;
using System.Net.Mail;

namespace api.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task<bool> SendEmailAsync(string emailTo, string subject, string message)
        {
            string emailFrom = _config["Email:Username"]!;
            string emailFromPassword = _config["Email:Password"]!;
            try
            {
                SmtpClient smtpClient = new SmtpClient("smtp.gmail.com", 587)
                {
                    EnableSsl = true,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(emailFrom, emailFromPassword)
                };
                await smtpClient.SendMailAsync(
                new MailMessage(
                    from: emailFrom,
                    to: emailTo,
                    subject,
                    message
                    ));
            }
            catch (Exception ex)
            {
                Printer.Log("Error sending email: ", ex.Message);
                return false;
            }
            return true;
        }

    }
}
