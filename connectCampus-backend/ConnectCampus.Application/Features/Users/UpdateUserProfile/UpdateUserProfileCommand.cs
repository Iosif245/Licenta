using ConnectCampus.Application.Abstractions.Messaging;

namespace ConnectCampus.Application.Features.Users.UpdateUserProfile;

public record UpdateUserProfileCommand(
    Guid UserId,
    string FirstName,
    string LastName,
    string? Location,
    string? PhoneNumber,
    string? Bio) : ICommand;