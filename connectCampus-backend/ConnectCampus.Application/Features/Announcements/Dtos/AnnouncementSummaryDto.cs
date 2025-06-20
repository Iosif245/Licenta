using System;

namespace ConnectCampus.Application.Features.Announcements.Dtos
{
    public record AnnouncementSummaryDto(
        Guid Id,
        string Title,
        string Content,
        string? ImageUrl,
        DateTime PublishedDate,
        string AssociationName,
        Guid AssociationId);
} 