using api.Services;
using Google.Apis.Auth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace api.Test.Integration
{
    public class FakeExternalAuthService: IExternalAuthService
    {
        public Task<GoogleJsonWebSignature.Payload?> VerifyGoogleToken(string idToken)
        {
            if(idToken == "invalidToken")
            {
                return Task.FromResult<GoogleJsonWebSignature.Payload?>(null);
            }
            return Task.FromResult<GoogleJsonWebSignature.Payload?>(new GoogleJsonWebSignature.Payload
            {
                Email = "testAuth@gmail.com",
                Subject = "1234567890",
                Name = "Test Auth User",
            });
        }
    }
}
