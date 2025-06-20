using System;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Features.Announcements.Dtos;
using ConnectCampus.Domain.Enums;

namespace ConnectCampus.Application.Features.Announcements.Queries.GetAnnouncementWithInteractions
{
    public record GetAnnouncementWithInteractionsQuery(
        Guid AnnouncementId,
        Guid? UserId = null,
        AuthorType? UserType = null
    ) : IQuery<AnnouncementWithInteractionsDto>;
} 
 
 