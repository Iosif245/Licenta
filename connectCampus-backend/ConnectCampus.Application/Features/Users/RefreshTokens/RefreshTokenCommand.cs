using ConnectCampus.Application.Abstractions.Messaging;

namespace ConnectCampus.Application.Features.Users.RefreshTokens
{
    public record RefreshTokenCommand : ICommand<RefreshTokenResponse>;
} 