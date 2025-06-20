using System;
using System.Collections.Generic;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Features.Associations.Dtos;

namespace ConnectCampus.Application.Features.Follows.Queries.GetFollowedAssociations
{
    public record GetFollowedAssociationsQuery(Guid StudentId) : IQuery<List<AssociationSummaryDto>>;
} 