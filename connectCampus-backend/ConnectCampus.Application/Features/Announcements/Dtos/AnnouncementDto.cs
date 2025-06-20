using System;

namespace ConnectCampus.Application.Features.Announcements.Dtos
{
    public record AnnouncementDto(
        Guid Id,
        Guid AssociationId,
        Guid? EventId,
        string Title,
        string Content,
        string? ImageUrl,
        DateTime PublishedDate,
        string AssociationName,
        string? EventName,
        DateTime CreatedAt,
        DateTime UpdatedAt);
} 