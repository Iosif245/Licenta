using System;
using System.Collections.Generic;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Features.Announcements.Dtos;

namespace ConnectCampus.Application.Features.Announcements.Queries.ListAnnouncements
{
    public record ListAnnouncementsQuery(
        int Page = 1,
        int PageSize = 10,
        Guid? AssociationId = null,
        Guid? EventId = null
    ) : IQuery<List<AnnouncementSummaryDto>>;
} 