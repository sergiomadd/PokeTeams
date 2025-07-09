using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Configuration;

namespace api.PokedexTest
{
    internal class AppInstance : WebApplicationFactory<Program>, IDisposable
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.UseEnvironment("Test");

            builder.ConfigureAppConfiguration((hostingContext, config) => { config.AddUserSecrets<Program>(); });

            var configuration = new ConfigurationBuilder()
                .AddUserSecrets<AppInstance>().Build();

            builder.ConfigureTestServices(services =>
            {
                var configuration = new ConfigurationBuilder()
                    .AddUserSecrets<AppInstance>()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile("appsettings.Test.json", optional: true, reloadOnChange: true)
                    .Build();

                var test = configuration;
            });
        }
    }
}
