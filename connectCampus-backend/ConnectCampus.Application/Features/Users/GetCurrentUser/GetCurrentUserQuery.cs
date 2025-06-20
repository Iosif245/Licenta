using ConnectCampus.Application.Abstractions.Messaging;

namespace ConnectCampus.Application.Features.Users.GetCurrentUser
{
    public record GetCurrentUserQuery : IQuery<CurrentUserResponse>;
} 