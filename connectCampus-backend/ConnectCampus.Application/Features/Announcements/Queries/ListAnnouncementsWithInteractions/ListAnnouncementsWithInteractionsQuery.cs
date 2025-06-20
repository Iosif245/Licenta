using System;
using System.Collections.Generic;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Features.Announcements.Dtos;
using ConnectCampus.Domain.Enums;

namespace ConnectCampus.Application.Features.Announcements.Queries.ListAnnouncementsWithInteractions
{
    public record ListAnnouncementsWithInteractionsQuery(
        int Page = 1,
        int PageSize = 10,
        Guid? AssociationId = null,
        Guid? EventId = null,
        Guid? UserId = null,
        AuthorType? UserType = null
    ) : IQuery<List<AnnouncementSummaryWithInteractionsDto>>;
} 
 
 