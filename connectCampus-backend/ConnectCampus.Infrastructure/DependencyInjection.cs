using System.Text;
using Amazon;
using Amazon.Extensions.NETCore.Setup;
using Amazon.Runtime;
using Amazon.S3;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Domain.Common.Time;
using ConnectCampus.Infrastructure.Configuration.Settings;
using ConnectCampus.Infrastructure.Persistence;
using ConnectCampus.Infrastructure.Persistence.Repositories;
using ConnectCampus.Infrastructure.Services;
using ConnectCampus.Infrastructure.Time;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Infrastructure.Configuration;
using ConnectCampus.Infrastructure.Services.Storage;
using ConnectCampus.Application.Abstractions.Services;
using ConnectCampus.Infrastructure.SignalR;

namespace ConnectCampus.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            services.AddAppConfiguration(configuration);
            
            services.AddDbContext<ApplicationDbContext>(options =>
            {
                var connectionString = configuration.GetConnectionString("DefaultConnection");
                
                Console.WriteLine($"[DEBUG] Raw connection string: '{connectionString}'");
                Console.WriteLine($"[DEBUG] ConnectionStrings__DefaultConnection env var: '{Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")}'");
                
                // Simple fallback if config is empty
                if (string.IsNullOrEmpty(connectionString))
                {
                    connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection");
                    Console.WriteLine($"[DEBUG] Using fallback env var: '{connectionString}'");
                }
                
                // Convert PostgreSQL URI format to Npgsql format if needed
                if (!string.IsNullOrEmpty(connectionString) && 
                    (connectionString.StartsWith("postgresql://") || connectionString.StartsWith("postgres://")))
                {
                    connectionString = ConvertPostgreSqlUriToConnectionString(connectionString);
                    Console.WriteLine($"[DEBUG] Converted connection string: '{connectionString?.Substring(0, Math.Min(50, connectionString?.Length ?? 0))}...'");
                }
                
                options.UseNpgsql(
                    connectionString,
                    b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName));
            });

            services.AddScoped<IDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
            services.AddScoped<ICertificateRepository, CertificateRepository>();
            services.AddScoped<IStudentRepository, StudentRepository>();
            services.AddScoped<IAssociationRepository, AssociationRepository>();
            services.AddScoped<IFollowRepository, FollowRepository>();
            services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
            services.AddScoped<IDateTimeMachine, MachineDateTime>();
            services.AddScoped<IRefreshTokenService, RefreshTokenService>();
            services.AddSingleton<IPasswordHasher, PasswordHasher>();
            services.AddScoped<INotificationRepository, NotificationRepository>();
            services.AddScoped<IEventRepository, EventRepository>();
            services.AddScoped<IAnnouncementRepository, AnnouncementRepository>();
            services.AddScoped<IReportRepository, ReportRepository>();
            services.AddScoped<IAnnouncementLikeRepository, AnnouncementLikeRepository>();
            services.AddScoped<IAnnouncementCommentRepository, AnnouncementCommentRepository>();
            services.AddScoped<IPasswordResetTokenRepository, PasswordResetTokenRepository>();
            services.AddScoped<ITwoFactorCodeRepository, TwoFactorCodeRepository>();
            services.AddScoped<IStudentEventRegistrationRepository, StudentEventRegistrationRepository>();
            services.AddScoped<IChatGroupRepository, ChatGroupRepository>();
            services.AddScoped<IStudentFavoriteEventRepository, StudentFavoriteEventRepository>();
            services.AddSingleton<ISlugGenerator, SlugGenerator>();
            

            services.AddHttpContextAccessor();
            services.AddScoped<ICurrentUserService, CurrentUserService>();

            var jwtSettings = new JwtSettings();
            configuration.GetSection(JwtSettings.SectionName).Bind(jwtSettings);
            
            services.AddAuthorization();
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings.Issuer,
                    ValidAudience = jwtSettings.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtSettings.Secret))
                };
                
                // Configure SignalR to accept JWT tokens from query string
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];
                        var path = context.HttpContext.Request.Path;
                        
                        // If the request is for our SignalR hub...
                        if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
                        {
                            // Read the token out of the query string
                            context.Token = accessToken;
                        }
                        return Task.CompletedTask;
                    }
                };
            });
            
            services.AddAWSService<IAmazonS3>();
            services.AddDefaultAWSOptions(s => new AWSOptions()
            {
                Credentials = new BasicAWSCredentials(
                    configuration.GetSection("AWS")["AccessKey"],
                    configuration.GetSection("AWS")["SecretKey"]),
                Region = RegionEndpoint.GetBySystemName(configuration.GetSection("AWS")["Region"])
            });
            
            services.AddScoped<IS3Handler, S3Handler>();

            services.AddScoped<EmailTemplateService>();
            services.AddScoped<IEmailService, SendGridEmailService>();
            services.AddScoped<IAIContentService, AIContentService>();

            // Register the background service for event status updates
            services.AddHostedService<StatusUpdateService>();
            
            services.AddSignalR();
            services.AddScoped<INotificationHubContext, NotificationHubContext>();

            return services;
        }
        
        private static string ConvertPostgreSqlUriToConnectionString(string uri)
        {
            var parsedUri = new Uri(uri);
            var host = parsedUri.Host;
            var port = parsedUri.Port;
            var database = parsedUri.AbsolutePath.TrimStart('/');
            var userInfo = parsedUri.UserInfo.Split(':');
            var username = userInfo[0];
            var password = userInfo.Length > 1 ? userInfo[1] : "";
            
            return $"Host={host};Port={port};Database={database};Username={username};Password={password};SSL Mode=Require;Trust Server Certificate=true;";
        }
    }
} 