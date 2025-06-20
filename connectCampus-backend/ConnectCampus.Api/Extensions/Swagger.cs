using Microsoft.AspNetCore.Authorization;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Reflection;

namespace ConnectCampus.Api.Extensions;

public static class AddSwagger
{
    public static IServiceCollection AddSwaggerProperties(this IServiceCollection services)
        {
            return services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { 
                    Title = "ConnectCampus API", 
                    Version = "v1",
                    Description = "API for the ConnectCampus platform",
                    Contact = new OpenApiContact
                    {
                        Name = "ConnectCampus Team"
                    }
                });
                c.AddSecurityDefinition(AuthorizationType.Bearer, new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    In = ParameterLocation.Header,
                    Scheme = AuthorizationType.Bearer,
                    Description = "Please insert the JWT token"
                });
                c.OperationFilter<BasicAuthOperationsFilter>();
                
                // Set the comments path for the Swagger JSON and UI
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                c.IncludeXmlComments(xmlPath);
            });
        }

    /// <summary>
    /// Marks routes annotated with [AllowAnonymous] attribute as being public. All other routes are marked as requiring authentication.
    /// </summary>
    private sealed class BasicAuthOperationsFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var noAuthRequired = context.ApiDescription.CustomAttributes().Any(attr => attr.GetType() == typeof(AllowAnonymousAttribute));

            if (noAuthRequired)
            {
                return;
            }

            operation.Security = new List<OpenApiSecurityRequirement>
            {
                new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Name = AuthorizationType.Bearer,
                            In = ParameterLocation.Header,
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = AuthorizationType.Bearer
                            },
                        },
                        Array.Empty<string>()
                    }
                }
            };
        }
    }

    private sealed class AuthorizationType
    {
        public const string Bearer = "Bearer";
    }
}
