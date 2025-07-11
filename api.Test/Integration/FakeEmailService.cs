using api.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace api.Test.Integration
{
    public class FakeEmailService : IEmailService
    {
        public string GetConfirmEmailBodyHTML(string confirmationLink)
        {
            return "";
        }

        public string GetResetPasswordBodyHTML(string resetLink)
        {
            return "";
        }

        public async Task<bool> SendEmailAsync(string email, string subject, string message)
        {
            if(email == "error@gmail.com") { return await Task.FromResult(false); }
            return await Task.FromResult(true);
        }
    }
}
