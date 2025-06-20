using System.Collections.Generic;
using ConnectCampus.Application.Features.Associations.Dtos;

namespace ConnectCampus.Application.Features.Follows.Dtos
{
    public record PagedFollowedAssociationsDto(
        IReadOnlyList<AssociationSummaryDto> Items,
        int PageNumber,
        int PageSize,
        int TotalCount,
        int TotalPages,
        bool HasPreviousPage,
        bool HasNextPage
    );
} 