using System.Collections.Generic;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Common.Models;
using ConnectCampus.Application.Features.Associations.Dtos;

namespace ConnectCampus.Application.Features.Associations.Queries.ListAssociations
{
    public record ListAssociationsQuery(
        PaginationParams? PaginationParams = null,
        string? Category = null
    ) : IQuery<object>;

    // Keep the old query for backward compatibility
    public record ListAssociationsSimpleQuery : IQuery<List<AssociationSummaryDto>>;
} 