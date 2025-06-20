namespace ConnectCampus.Application.Features.Users.RefreshTokens
{
    public record RefreshTokenResponse(
        string AccessToken,
        string RefreshToken);
} 