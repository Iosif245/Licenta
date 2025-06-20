namespace ConnectCampus.Application.Features.Users.GetCurrentUser
{
    public record CurrentUserResponse(
        Guid Id,
        string Email,
        string FirstName,
        string LastName,
        string Role,
        int UnreadNotificationsCount);
} 