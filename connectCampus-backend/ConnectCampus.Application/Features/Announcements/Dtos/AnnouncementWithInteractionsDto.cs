using System;

namespace ConnectCampus.Application.Features.Announcements.Dtos
{
    public record AnnouncementWithInteractionsDto(
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
        DateTime UpdatedAt,
        int LikeCount,
        int CommentCount,
        bool IsLikedByUser = false
    );
} 
 