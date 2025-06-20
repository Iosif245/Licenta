using ConnectCampus.Application.Abstractions.Messaging;

namespace ConnectCampus.Application.Features.Users.Login
{
    public record LoginCommand(
        string Email,
        string Password) : ICommand<LoginResponse>;
} 