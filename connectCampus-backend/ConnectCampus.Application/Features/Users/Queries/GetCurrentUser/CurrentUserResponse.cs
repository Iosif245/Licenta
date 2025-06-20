using ConnectCampus.Domain.Enums;

namespace ConnectCampus.Application.Features.Users.Queries.GetCurrentUser
{
    public record CurrentUserResponse(
        Guid Id,
        string Email,
        string Role);
} 