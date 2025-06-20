using System.Collections.Generic;

namespace ConnectCampus.Application.Features.Follows.Dtos
{
    public record PagedFollowersDto(
        IReadOnlyList<FollowerDto> Items,
        int PageNumber,
        int PageSize,
        int TotalCount,
        int TotalPages,
        bool HasPreviousPage,
        bool HasNextPage
    );
} 