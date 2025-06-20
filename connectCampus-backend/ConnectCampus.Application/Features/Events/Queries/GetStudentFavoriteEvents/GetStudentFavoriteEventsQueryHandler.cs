using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Features.Events.Dtos;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Events.Queries.GetStudentFavoriteEvents
{
    public class GetStudentFavoriteEventsQueryHandler : IQueryHandler<GetStudentFavoriteEventsQuery, List<EventFavoriteDto>>
    {
        private readonly IStudentFavoriteEventRepository _favoriteRepository;

        public GetStudentFavoriteEventsQueryHandler(IStudentFavoriteEventRepository favoriteRepository)
        {
            _favoriteRepository = favoriteRepository;
        }

        public async Task<Maybe<List<EventFavoriteDto>>> Handle(GetStudentFavoriteEventsQuery request, CancellationToken cancellationToken)
        {
            var favorites = await _favoriteRepository.GetByStudentIdAsync(request.StudentId, cancellationToken);

            var paginatedFavorites = favorites
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToList();

            var result = paginatedFavorites.Select(f => new EventFavoriteDto(
                f.Id,
                f.StudentId,
                f.EventId,
                f.CreatedAt,
                new EventSummaryDto(
                    f.Event.Id,
                    f.Event.Title,
                    f.Event.Slug,
                    f.Event.Description,
                    f.Event.CoverImageUrl,
                    f.Event.StartDate,
                    f.Event.EndDate,
                    f.Event.Location,
                    f.Event.Category,
                    f.Event.Tags,
                    f.Event.IsFeatured,
                    f.Event.Price,
                    f.Event.IsFree,
                    f.Event.Status.ToString(),
                    f.Event.AttendeesCount,
                    f.Event.AssociationName,
                    f.Event.AssociationLogo,
                    f.Event.Type.ToString(),
                    f.Event.AssociationId
                )
            )).ToList();

            return result;
        }
    }
} 