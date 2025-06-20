using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Features.Users.Login;

namespace ConnectCampus.Application.Features.Auth.Commands.VerifyTwoFactor
{
    public record VerifyTwoFactorCommand(
        string UserId,
        string Code) : ICommand<LoginResponse>;
} 