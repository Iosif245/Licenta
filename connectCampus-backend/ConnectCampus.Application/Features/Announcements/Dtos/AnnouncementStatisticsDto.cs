using System;

namespace ConnectCampus.Application.Features.Announcements.Dtos
{
    public record AnnouncementStatisticsDto(
        Guid AnnouncementId,
        int TotalLikes,
        int TotalComments,
        int TotalReplies,
        int StudentLikes,
        int AssociationLikes,
        int StudentComments,
        int AssociationComments,
        DateTime? LastInteractionDate
    );
} 
 
 