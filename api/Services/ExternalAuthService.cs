using api.Util;
using Google.Apis.Auth;

namespace api.Services
{
    public class ExternalAuthService : IExternalAuthService
    {
        private readonly IConfiguration _config;
        private readonly Printer Printer;

        public ExternalAuthService(IConfiguration config, Printer printer)
        {
            _config = config;
            Printer = printer;
        }

        public async Task<GoogleJsonWebSignature.Payload?> VerifyGoogleToken(string idToken)
        {
            try
            {
                var settings = new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new[] { _config["Google:Id"] }
                };

                return await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
            }
            catch (Exception ex)
            {
                Printer.Log("Error verifiyng google token ", ex);
            }
            return null;
        }
    }
}
