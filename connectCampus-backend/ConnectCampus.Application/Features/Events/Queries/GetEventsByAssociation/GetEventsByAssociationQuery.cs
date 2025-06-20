using System;
using System.Collections.Generic;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Features.Events.Dtos;

namespace ConnectCampus.Application.Features.Events.Queries.GetEventsByAssociation
{
    public record GetEventsByAssociationQuery(
        Guid AssociationId, 
        bool UpcomingOnly = true
    ) : IQuery<List<EventSummaryDto>>;
} 