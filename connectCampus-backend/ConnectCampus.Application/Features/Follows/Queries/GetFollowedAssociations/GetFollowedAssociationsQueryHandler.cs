using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Features.Associations.Dtos;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Follows.Queries.GetFollowedAssociations
{
    public class GetFollowedAssociationsQueryHandler : IQueryHandler<GetFollowedAssociationsQuery, List<AssociationSummaryDto>>
    {
        private readonly IFollowRepository _followRepository;

        public GetFollowedAssociationsQueryHandler(IFollowRepository followRepository)
        {
            _followRepository = followRepository;
        }

        public async Task<Maybe<List<AssociationSummaryDto>>> Handle(GetFollowedAssociationsQuery request, CancellationToken cancellationToken)
        {
            var follows = await _followRepository.GetFollowsByStudentIdAsync(request.StudentId, cancellationToken);

            var associations = follows.Select(f => f.Association).ToList();

            var associationDtos = associations.Select(a => new AssociationSummaryDto(
                a.Id,
                a.Name,
                a.Slug,
                a.Description,
                a.Logo,
                a.CoverImage,
                a.Category,
                a.FoundedYear,
                a.IsVerified,
                a.Events,
                a.UpcomingEventsCount,
                a.Followers,
                a.Location,
                a.Website,
                a.Tags,
                a.CreatedAt,
                a.UpdatedAt
            )).ToList();

            return associationDtos;
        }
    }
} 