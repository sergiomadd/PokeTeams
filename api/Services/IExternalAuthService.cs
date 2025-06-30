using Google.Apis.Auth;

namespace api.Services
{
    public interface IExternalAuthService
    {
        Task<GoogleJsonWebSignature.Payload?> VerifyGoogleToken(string idToken);
    }
}
