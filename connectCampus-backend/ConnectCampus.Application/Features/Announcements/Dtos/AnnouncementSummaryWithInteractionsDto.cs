using System;

namespace ConnectCampus.Application.Features.Announcements.Dtos
{
    public record AnnouncementSummaryWithInteractionsDto(
        Guid Id,
        string Title,
        string Content,
        string? ImageUrl,
        DateTime PublishedDate,
        string AssociationName,
        Guid AssociationId,
        int LikeCount,
        int CommentCount,
        bool IsLikedByUser = false
    );
} 
 
 