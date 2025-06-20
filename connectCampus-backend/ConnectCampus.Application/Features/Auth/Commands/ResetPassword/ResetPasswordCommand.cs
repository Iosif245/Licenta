using ConnectCampus.Application.Abstractions.Messaging;

namespace ConnectCampus.Application.Features.Auth.Commands.ResetPassword
{
    public record ResetPasswordCommand(
        string Token, 
        string NewPassword) : ICommand<bool>;
} 