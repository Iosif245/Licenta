using System;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Common.Models;
using ConnectCampus.Application.Features.Follows.Dtos;

namespace ConnectCampus.Application.Features.Follows.Queries.GetFollowers
{
    public record GetFollowersPagedQuery(
        Guid AssociationId,
        PaginationParams PaginationParams
    ) : IQuery<PagedFollowersDto>;
} 