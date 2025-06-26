using ConnectCampus.Application;
using ConnectCampus.Infrastructure;
using ConnectCampus.Api.Extensions;
using ConnectCampus.Api.Middleware;
using ConnectCampus.Infrastructure.Persistence;
using ConnectCampus.Infrastructure.SignalR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddHttpContextAccessor();
builder.Services.AddHttpClient(); // Add HttpClient for AI service
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerProperties();

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});
builder.Services.AddCors(options => options.AddPolicy("LocalhostPolicy", builder => builder.WithOrigins(
    "http://localhost:5174", 
    "http://localhost:5173",
    "https://licenta-mocha.vercel.app" // Domeniul Vercel
) 
    .AllowAnyHeader() 
    .AllowAnyMethod() 
    .AllowCredentials()));

var app = builder.Build();

// Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("LocalhostPolicy");

app.UseHttpsRedirection();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<ChatHub>("/hubs/chat");
app.MapHub<NotificationHub>("/hubs/notifications");

app.UseMiddleware<ExceptionHandlingMiddleware>();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.Migrate();
}

app.Run();
