using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Features.Certificates;

namespace ConnectCampus.Application.Features.Users.GetUserProfile;

public record GetUserProfileQuery(Guid UserId) : IQuery<UserProfileDto>;

public record UserProfileDto(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    string Role,
    string? Avatar,
    string? Location,
    string? PhoneNumber,
    string? Bio,
    string? StripeCustomerId,
    IEnumerable<CertificateDto>? Certificates,
    DateTime CreatedAt,
    DateTime? UpdatedAt); 