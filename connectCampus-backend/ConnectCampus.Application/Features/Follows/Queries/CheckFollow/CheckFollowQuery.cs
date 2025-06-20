using System;
using ConnectCampus.Application.Abstractions.Messaging;

namespace ConnectCampus.Application.Features.Follows.Queries.CheckFollow
{
    public record CheckFollowQuery(Guid StudentId, Guid AssociationId) : IQuery<bool>;
} 