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
                MailMessage mailMessage = new MailMessage(
                    from: emailFrom,
                    to: emailTo,
                    subject,
                    message);
                mailMessage.IsBodyHtml = true;
                await smtpClient.SendMailAsync(mailMessage);
            }
            catch (Exception ex)
            {
                Printer.Log("Error sending email: ", ex.Message);
                return false;
            }
            return true;
        }

        public string GetConfirmEmailBodyHTML(string confirmationLink)
        {
            return $@"
            <html>
              <body style=""font-family: Arial, sans-serif; color: #333;"">
                <table style=""margin: auto;"">
                  <tr>
                    <td align=""center"" colspan=""2"" style=""padding-bottom: 20px;"">
                      <table cellpadding=""0"" cellspacing=""0"" border=""0"">
                        <tr>
                          <td style=""text-align: center;"">
                            <img src=""https://poketeams.com/assets/img/logo.png"" alt=""Icon"" width=""50"" height=""50"">
                          </td>
                          <td style=""padding-left: 10px; vertical-align: middle;"">
                            <span style=""font-size: 1.3em;"">POKETEAMS</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td colspan=""2"" style=""padding-bottom: 20px;"">
                      <p style=""margin: 0;"">
                        <span>Hello trainer,</span><br>
                        <span>thanks for signing up on poketeams.com</span><br>
                        <span>click this button to confirm your email.</span>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align=""center"" colspan=""2"" style=""padding-bottom: 20px;"">
                      <a href=""{confirmationLink}"" 
                        style=""display: inline-block; padding: 10px 20px; background-color: #e3262d; 
                               color: white; text-decoration: none; border-radius: 5px; font-weight: bold;"">
                        Confirm Email
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td colspan=""2"" style=""padding-bottom: 20px;"">
                      If you don't see a button above, click this link: 
                      <a href=""{confirmationLink}"">Confirm Email</a>
                    </td>
                  </tr>
                </table>
              </body>
            </html>
            ";
        }

        public string GetResetPasswordBodyHTML(string resetLink)
        {
            return $@"
            <html>
              <body style=""font-family: Arial, sans-serif; color: #333;"">
                <table style=""margin: auto;"">
                  <tr>
                    <td align=""center"" colspan=""2"" style=""padding-bottom: 20px;"">
                      <table cellpadding=""0"" cellspacing=""0"" border=""0"">
                        <tr>
                          <td style=""text-align: center;"">
                            <img src=""https://poketeams.com/assets/img/logo.png"" alt=""Icon"" width=""50"" height=""50"">
                          </td>
                          <td style=""padding-left: 10px; vertical-align: middle;"">
                            <span style=""font-size: 1.3em;"">POKETEAMS</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td colspan=""2"" style=""padding-bottom: 20px;"">
                      <p style=""margin: 0;"">
                        <span>Hello trainer,</span><br>
                        <span>click this button reset your password.</span>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align=""center"" colspan=""2"" style=""padding-bottom: 20px;"">
                      <a href=""{resetLink}"" 
                        style=""display: inline-block; padding: 10px 20px; background-color: #e3262d; 
                               color: white; text-decoration: none; border-radius: 5px; font-weight: bold;"">
                        Reset password
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td colspan=""2"" style=""padding-bottom: 20px;"">
                      If you don't see a button above, click this link: 
                      <a href=""{resetLink}"">Reset password</a>
                    </td>
                  </tr>
                </table>
              </body>
            </html>
            ";
        }
    }
}
