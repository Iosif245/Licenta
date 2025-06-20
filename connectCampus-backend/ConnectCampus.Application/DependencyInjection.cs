using FluentValidation;
using MediatR;
using ConnectCampus.Application.Common.Behaviors;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace ConnectCampus.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            var assembly = Assembly.GetExecutingAssembly();
            
            services.AddMediatR(config => 
            {
                config.RegisterServicesFromAssembly(assembly);
                config.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
                config.AddOpenBehavior(typeof(LoggingBehavior<,>));
            });
            
            services.AddValidatorsFromAssembly(assembly);

            return services;
        }
    }
}