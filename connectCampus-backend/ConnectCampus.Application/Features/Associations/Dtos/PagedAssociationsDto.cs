using System.Collections.Generic;

namespace ConnectCampus.Application.Features.Associations.Dtos
{
    public record PagedAssociationsDto(
        IReadOnlyList<AssociationSummaryDto> Items,
        int PageNumber,
        int PageSize,
        int TotalCount,
        int TotalPages,
        bool HasPreviousPage,
        bool HasNextPage
    );
} 