using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Follows.Queries.CheckFollow
{
    public class CheckFollowQueryHandler : IQueryHandler<CheckFollowQuery, bool>
    {
        private readonly IFollowRepository _followRepository;

        public CheckFollowQueryHandler(IFollowRepository followRepository)
        {
            _followRepository = followRepository;
        }

        public async Task<Maybe<bool>> Handle(CheckFollowQuery request, CancellationToken cancellationToken)
        {
            var exists = await _followRepository.ExistsAsync(request.StudentId, request.AssociationId, cancellationToken);
            return exists;
        }
    }
} 