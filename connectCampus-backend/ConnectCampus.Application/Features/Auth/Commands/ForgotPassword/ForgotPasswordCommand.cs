using ConnectCampus.Application.Abstractions.Messaging;

namespace ConnectCampus.Application.Features.Auth.Commands.ForgotPassword
{
    public record ForgotPasswordCommand(string Email) : ICommand<bool>;
} 