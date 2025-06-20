namespace ConnectCampus.Application.Features.Events.Dtos;

public record EventAttendeeDto(
    Guid Id,
    Guid StudentId,
    string FirstName,
    string LastName,
    string Email,
    string? EducationLevel,
    string? AvatarUrl,
    DateTime RegisteredAt,
    bool IsAttended
); 