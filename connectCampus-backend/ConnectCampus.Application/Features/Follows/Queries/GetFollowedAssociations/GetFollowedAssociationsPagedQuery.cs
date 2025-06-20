using System;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Common.Models;
using ConnectCampus.Application.Features.Follows.Dtos;

namespace ConnectCampus.Application.Features.Follows.Queries.GetFollowedAssociations
{
    public record GetFollowedAssociationsPagedQuery(
        Guid StudentId,
        PaginationParams PaginationParams
    ) : IQuery<PagedFollowedAssociationsDto>;
} 