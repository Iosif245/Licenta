using System;
using ConnectCampus.Domain.Enums;

namespace ConnectCampus.Application.Features.Announcements.Dtos
{
    public record AnnouncementLikeDto(
        Guid Id,
        Guid AnnouncementId,
        Guid AuthorId,
        AuthorType AuthorType,
        string AuthorName,
        DateTime CreatedAt
    );
} 
 
 