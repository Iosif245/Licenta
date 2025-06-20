using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Features.Associations.Dtos;
using ConnectCampus.Application.Features.Follows.Dtos;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Follows.Queries.GetFollowedAssociations
{
    public class GetFollowedAssociationsPagedQueryHandler : IQueryHandler<GetFollowedAssociationsPagedQuery, PagedFollowedAssociationsDto>
    {
        private readonly IFollowRepository _followRepository;

        public GetFollowedAssociationsPagedQueryHandler(IFollowRepository followRepository)
        {
            _followRepository = followRepository;
        }

        public async Task<Maybe<PagedFollowedAssociationsDto>> Handle(GetFollowedAssociationsPagedQuery request, CancellationToken cancellationToken)
        {
            var pagedAssociations = await _followRepository.GetFollowedAssociationsByStudentIdPagedAsync(
                request.StudentId, request.PaginationParams, cancellationToken);

            var associationDtos = pagedAssociations.Items.Select(association => new AssociationSummaryDto(
                association.Id,
                association.Name,
                association.Slug,
                association.Description,
                association.Logo,
                association.CoverImage,
                association.Category,
                association.FoundedYear,
                association.IsVerified,
                association.Events,
                association.UpcomingEventsCount,
                association.Followers,
                association.Location,
                association.Website,
                association.Tags,
                association.CreatedAt,
                association.UpdatedAt
            )).ToList();

            var result = new PagedFollowedAssociationsDto(
                associationDtos,
                pagedAssociations.PageNumber,
                pagedAssociations.PageSize,
                pagedAssociations.TotalCount,
                pagedAssociations.TotalPages,
                pagedAssociations.HasPreviousPage,
                pagedAssociations.HasNextPage
            );

            return result;
        }
    }
} 