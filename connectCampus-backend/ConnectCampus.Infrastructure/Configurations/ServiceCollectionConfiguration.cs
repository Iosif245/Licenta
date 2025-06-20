using System.Reflection;
using FluentValidation;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Domain.Common.Time;
using ConnectCampus.Infrastructure.Configuration.Extensions;
using ConnectCampus.Infrastructure.Configuration.Settings;
using ConnectCampus.Infrastructure.Services;
using ConnectCampus.Infrastructure.Time;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ConnectCampus.Infrastructure.Configuration;

public static class ServiceCollectionConfiguration
{
    public static IServiceCollection AddAppConfiguration(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly(), includeInternalTypes: true);
        services.AddScoped<IDateTimeMachine, MachineDateTime>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        
        services.AddOptions<JwtSettings>()
            .Bind(configuration.GetSection(JwtSettings.SectionName))
            .ValidateFluentValidation()
            .ValidateOnStart();

        services.AddOptions<EmailSettings>()
            .Bind(configuration.GetSection(EmailSettings.SectionName))
            // .ValidateFluentValidation()
            .ValidateOnStart();
        
        services.AddOptions<RefreshTokenSettings>()
            .Bind(configuration.GetSection(RefreshTokenSettings.SectionName))
            .ValidateFluentValidation()
            .ValidateOnStart();
        
        services.AddOptions<StripeSettings>()
            .Bind(configuration.GetSection(StripeSettings.SectionName))
            // .ValidateFluentValidation()
            .ValidateOnStart();
        
        services.AddOptions<S3Settings>()
            .Bind(configuration.GetSection(S3Settings.SettingsKey))
            .ValidateFluentValidation()
            .ValidateOnStart();
        
        services.AddOptions<AISettings>()
            .Bind(configuration.GetSection(AISettings.SectionName))
            .ValidateFluentValidation()
            .ValidateOnStart();
        
        return services;
    }
}