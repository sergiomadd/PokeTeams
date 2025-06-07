using api.Util;
using System.Threading.RateLimiting;

namespace api.Middlewares
{
    public class RateLimitResponseAttribute : Attribute
    {
        public string Message { get; }

        public RateLimitResponseAttribute(string message)
        {
            Message = message;
        }
    }

    public static class RateLimiters
    {
        public static IServiceCollection AddCustomRateLimiters(this IServiceCollection services)
        {
            services.AddRateLimiter(options =>
            {
                options.OnRejected = async (context, token) =>
                {
                    context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                    context.HttpContext.Response.ContentType = "application/json";

                    var endpoint = context.HttpContext.GetEndpoint();
                    var messageAttribute = endpoint?.Metadata.GetMetadata<RateLimitResponseAttribute>();
                    var message = messageAttribute?.Message ?? "Too many requests. Please try again later.";
                    await context.HttpContext.Response.WriteAsJsonAsync(new { error = message }, token);
                };

                //Global
                options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
                {
                    var ip = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                    return RateLimitPartition.GetFixedWindowLimiter(ip, _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = 300,
                        Window = TimeSpan.FromSeconds(5),
                        QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                        QueueLimit = 0
                    });
                });

                //Email sending limiter
                /* 
                 * - Email confirmation request
                 * - Forgot password request
                 */
                options.AddPolicy("ipEmailLimiter", context =>
                {
                    var ip = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                    return RateLimitPartition.GetTokenBucketLimiter(ip, _ => new TokenBucketRateLimiterOptions
                    {
                        TokenLimit = 3,
                        TokensPerPeriod = 3,
                        ReplenishmentPeriod = TimeSpan.FromDays(1),
                        AutoReplenishment = true
                    });
                });

                //Auth critical funcitons limiter -> 2 per day
                /* 
                 * - Sign up
                 * - Name change
                 * - Username change
                 * - Email change
                 * - Password change
                 */
                options.AddPolicy("authLimiterHard", context =>
                {
                    var ip = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                    return RateLimitPartition.GetFixedWindowLimiter(ip, _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = 2,
                        Window = TimeSpan.FromDays(2),
                        QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                        QueueLimit = 0
                    });
                });

                //Auth extra funcitons limiter
                /* 
                 * - Profile pic change
                 * - Country change
                 * - Visibility change
                 */
                options.AddPolicy("authLimiterSoft", context =>
                {
                    var ip = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                    return RateLimitPartition.GetFixedWindowLimiter(ip, _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = 5,
                        Window = TimeSpan.FromMinutes(5),
                        QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                        QueueLimit = 0
                    });
                });

                //Auth base funcitons limiter
                /* 
                 * - Log in
                 */
                options.AddPolicy("authLimiterBase", context =>
                {
                    var ip = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                    return RateLimitPartition.GetFixedWindowLimiter(ip, _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = 3,
                        Window = TimeSpan.FromMinutes(5),
                        QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                        QueueLimit = 0
                    });
                });

                //Team upload limiter -> 2 every 5s
                options.AddPolicy("teamUploadLimiter", context =>
                {
                    var ip = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                    return RateLimitPartition.GetFixedWindowLimiter(ip, _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = 2,
                        Window = TimeSpan.FromSeconds(5),
                        QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                        QueueLimit = 0
                    });
                });

                //Search limiter -> two search operation per 2 seconds
                options.AddPolicy("teamSearchLimiter", context =>
                {
                    var ip = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                    return RateLimitPartition.GetFixedWindowLimiter(ip, _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = 2,
                        Window = TimeSpan.FromSeconds(2),
                        QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                        QueueLimit = 0
                    });
                });

                //Team get limiter -> 100 every 1s
                options.AddPolicy("teamGetLimiter", context =>
                {
                    var ip = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                    return RateLimitPartition.GetTokenBucketLimiter(ip, _ => new TokenBucketRateLimiterOptions
                    {
                        TokenLimit = 100,
                        TokensPerPeriod = 100,
                        ReplenishmentPeriod = TimeSpan.FromSeconds(1),
                        AutoReplenishment = true
                    });
                });
            });

            return services;
        }
    }

}
