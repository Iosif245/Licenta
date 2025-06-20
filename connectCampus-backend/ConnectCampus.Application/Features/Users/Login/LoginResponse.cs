namespace ConnectCampus.Application.Features.Users.Login
{
    public record LoginResponse(
        string? AccessToken,
        string? RefreshToken,
        bool RequiresTwoFactor,
        string? UserId);
} 