global using api.Models;

using api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using api.Models.DBPoketeamModels;
using api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using api.Util;
using Microsoft.OpenApi.Models;
using api.Services.PokedexServices;
using api.Middlewares;
using System.Configuration;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddMvc();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddControllers();
builder.Services.AddHttpContextAccessor();

builder.Services.AddDbContext<PokedexContext>(options => options.UseNpgsql(builder.Configuration["ConnectionStrings:PostgrePokedex"]), ServiceLifetime.Scoped);
builder.Services.AddDbContext<PokeTeamContext>(options => options.UseNpgsql(builder.Configuration["ConnectionStrings:PostgrePoketeam"]), ServiceLifetime.Scoped);
builder.Services.AddScoped<IPokedexContext, PokedexContext>();
builder.Services.AddScoped<IPokeTeamContext, PokeTeamContext>();

builder.Services.AddTransient<IIdentityService, IdentityService>();
builder.Services.AddTransient<Printer>();
builder.Services.AddTransient<IExternalAuthService, ExternalAuthService>();

builder.Services.AddScoped<IPokemonService, PokemonService>();
builder.Services.AddScoped<IItemService, ItemService>();
builder.Services.AddScoped<IAbilityService, AbilityService>();
builder.Services.AddScoped<IMoveService, MoveService>();
builder.Services.AddScoped<INatureService, NatureService>();
builder.Services.AddScoped<ITypeService, TypeService>();
builder.Services.AddScoped<IStatService, StatService>();

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<ITeamService, TeamService>();
builder.Services.AddScoped<ITournamentService, TournamentService>();
builder.Services.AddScoped<IRegulationService, RegulationService>();
builder.Services.AddScoped<ITagService, TagService>();

builder.Services.AddSingleton<TokenGenerator>();
builder.Services.AddAuthentication(option =>
    {
        option.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        option.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        option.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddGoogle("google", opt =>
    {
        opt.ClientId = builder.Configuration["Google:Secret"] ?? "";
        opt.ClientSecret = builder.Configuration["Google:Id"] ?? "";
        opt.SignInScheme = JwtBearerDefaults.AuthenticationScheme;
        opt.CallbackPath = "/auth/signin-google";
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]!)),
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
            ValidAudience = builder.Configuration["JwtSettings:Audience"],
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true
        };

        options.Events = new JwtBearerEvents
        { 
            OnMessageReceived = context =>
            {
                context.Request.Cookies.TryGetValue("accessToken", out var accessToken);
                if(!string.IsNullOrEmpty(accessToken))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            },
            OnChallenge = async context =>
            {
                //Suppress the default challenge response
                context.HandleResponse();

                context.Request.Cookies.TryGetValue("accessToken", out var accessToken);
                context.Request.Cookies.TryGetValue("refreshToken", out var refreshToken);
                if (string.IsNullOrEmpty(accessToken) && string.IsNullOrEmpty(refreshToken))
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync("NoTokensProvided");
                }
                else if (string.IsNullOrEmpty(refreshToken))
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync("NoRefreshTokenProvided");
                }
                else if (string.IsNullOrEmpty(accessToken))
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync("NoAccessTokenProvided");
                }
            },
            OnAuthenticationFailed = async context =>
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync("AuthenticationFailed");
            },
            OnForbidden = async context =>
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync("AuthenticationForbidden");
            },
        };
    });
builder.Services.AddAuthorization();

builder.Services.AddIdentity<User, IdentityRole>(
    options =>
    {
        //Password
        options.Password.RequiredLength = 4;
        options.Password.RequireDigit = false;
        options.Password.RequireLowercase = false;
        options.Password.RequireUppercase = false;
        options.Password.RequireNonAlphanumeric = false;

        //Require email confirmation
        options.SignIn.RequireConfirmedEmail = false;

        //Lockout
        options.Lockout.AllowedForNewUsers = true;
        options.Lockout.MaxFailedAccessAttempts = 5;
    })
    .AddRoles<IdentityRole>()
    .AddRoleManager<RoleManager<IdentityRole>>()
    .AddSignInManager<SignInManager<User>>()
    .AddUserManager<UserManager<User>>()
    .AddDefaultTokenProviders()
    .AddEntityFrameworkStores<PokeTeamContext>();

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromSeconds(1800);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

builder.Services.AddRouting(options => options.LowercaseUrls = true);

var devCors = "DevCorsPolicy";
var prodCors = "ProdCorsPolicy";
builder.Services.AddCors(options =>
{
    options.AddPolicy(devCors,
        builder =>
        {
            builder.WithOrigins("http://localhost:4200", "https://localhost:7134/")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
        });

    options.AddPolicy(prodCors,
    builder =>
    {
        builder.WithOrigins("https://poketeams.com", "https://poketeams.com/")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

builder.Services.AddCustomRateLimiters();

builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
    .AddEnvironmentVariables();

//builder.Services.AddSwaggerGen();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Your API", Version = "v1" });

    // Register your custom header operation filter
    c.OperationFilter<AcceptLanguageHeaderParameter>();
});

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.SetMinimumLevel(LogLevel.Information);

var app = builder.Build();

//Auto-Migrate on App Startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<PokeTeamContext>();
        context.Database.Migrate();
    }
    catch (Exception ex)
    {
        Console.WriteLine("Auto-migration error: " + ex.Message);
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    app.UseCors(devCors);
}
else
{
    app.UseCors(prodCors);
}

app.UseMiddleware<ExceptionHandlingMiddleware>();

if (!app.Environment.IsEnvironment("Test"))
{
    app.UseRateLimiter();
    app.UseHttpsRedirection();
}

app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

//For test reference
public partial class Program { };