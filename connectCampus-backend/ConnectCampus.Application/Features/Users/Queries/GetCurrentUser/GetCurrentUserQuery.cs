using ConnectCampus.Application.Abstractions.Messaging;

namespace ConnectCampus.Application.Features.Users.Queries.GetCurrentUser
{
    public record GetCurrentUserQuery() : IQuery<CurrentUserResponse>;
} 