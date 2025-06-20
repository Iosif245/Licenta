using ConnectCampus.Application.Abstractions.Messaging;

namespace ConnectCampus.Application.Features.Users.Register
{
    public record RegisterUserCommand(
        string Email,
        string Password,
        string Role) : ICommand<Guid>;
} 