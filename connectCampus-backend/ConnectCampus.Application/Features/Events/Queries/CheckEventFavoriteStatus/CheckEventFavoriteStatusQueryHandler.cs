using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Domain.Common;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Events.Queries.CheckEventFavoriteStatus
{
    public class CheckEventFavoriteStatusQueryHandler : IQueryHandler<CheckEventFavoriteStatusQuery, bool>
    {
        private readonly IStudentFavoriteEventRepository _favoriteRepository;

        public CheckEventFavoriteStatusQueryHandler(IStudentFavoriteEventRepository favoriteRepository)
        {
            _favoriteRepository = favoriteRepository;
        }

        public async Task<Maybe<bool>> Handle(CheckEventFavoriteStatusQuery request, CancellationToken cancellationToken)
        {
            var isFavorited = await _favoriteRepository.ExistsByStudentAndEventAsync(
                request.StudentId, 
                request.EventId, 
                cancellationToken);

            return isFavorited;
        }
    }
} 