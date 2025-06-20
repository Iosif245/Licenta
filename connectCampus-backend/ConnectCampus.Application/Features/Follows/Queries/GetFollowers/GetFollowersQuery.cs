using System;
using System.Collections.Generic;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Features.Follows.Dtos;

namespace ConnectCampus.Application.Features.Follows.Queries.GetFollowers
{
    public record GetFollowersQuery(Guid AssociationId) : IQuery<List<FollowDto>>;
} 