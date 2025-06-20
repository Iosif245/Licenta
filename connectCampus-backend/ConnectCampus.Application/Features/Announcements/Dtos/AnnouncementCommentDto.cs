using System;
using System.Collections.Generic;
using ConnectCampus.Domain.Enums;

namespace ConnectCampus.Application.Features.Announcements.Dtos
{
    public record AnnouncementCommentDto(
        Guid Id,
        Guid AnnouncementId,
        Guid AuthorId,
        AuthorType AuthorType,
        string AuthorName,
        string? AuthorAvatarUrl,
        string Content,
        DateTime CreatedAt,
        DateTime UpdatedAt,
        Guid? ParentCommentId,
        List<AnnouncementCommentDto> Replies
    );
} 
 