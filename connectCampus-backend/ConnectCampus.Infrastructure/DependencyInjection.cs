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
                // Try direct environment variable first, then fallback to config
                var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL") 
                    ?? configuration.GetConnectionString("DefaultConnection");
                
                Console.WriteLine($"[DEBUG] FULL Connection string: '{connectionString}'");
                
                if (string.IsNullOrEmpty(connectionString))
                {
                    throw new InvalidOperationException("No database connection string found. Please set DATABASE_URL environment variable.");
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
    }
} 