using System.Security.Cryptography;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Infrastructure.Configuration.Settings;
using Microsoft.Extensions.Options;

namespace ConnectCampus.Infrastructure.Services;

public class RefreshTokenService : IRefreshTokenService
{
    private readonly RandomNumberGenerator _rng;
    private readonly RefreshTokenSettings _settings;

    public RefreshTokenService(
        IOptions<RefreshTokenSettings> settings)
    {
        _rng = RandomNumberGenerator.Create();
        _settings = settings.Value;
    }
    
    public string GenerateToken()
    {
        var randomBytes = new byte[_settings.Length];
        _rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }

    public DateTime GetExpiryTime(DateTime utcNow)
    {
        return utcNow.AddDays(_settings.ExpiryInDays);
    }
}