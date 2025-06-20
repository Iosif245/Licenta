using System;
using System.Collections.Generic;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Features.Events.Dtos;

namespace ConnectCampus.Application.Features.Events.Queries.GetStudentFavoriteEvents
{
    public record GetStudentFavoriteEventsQuery(
        Guid StudentId,
        int Page = 1,
        int PageSize = 10
    ) : IQuery<List<EventFavoriteDto>>;
} 