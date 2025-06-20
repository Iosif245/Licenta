using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Features.Events.Dtos;
using ConnectCampus.Domain.Common.Results;
using ConnectCampus.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace ConnectCampus.Application.Features.Events.Queries.GetEventsByAssociation
{
    public class GetEventsByAssociationQueryHandler : IQueryHandler<GetEventsByAssociationQuery, List<EventSummaryDto>>
    {
        private readonly IEventRepository _eventRepository;
        private readonly IAssociationRepository _associationRepository;
        private readonly IDbContext _dbContext;

        public GetEventsByAssociationQueryHandler(
            IEventRepository eventRepository, 
            IAssociationRepository associationRepository,
            IDbContext dbContext)
        {
            _eventRepository = eventRepository;
            _associationRepository = associationRepository;
            _dbContext = dbContext;
        }

        public async Task<Maybe<List<EventSummaryDto>>> Handle(GetEventsByAssociationQuery request, CancellationToken cancellationToken)
        {
            // First, check if the association exists
            var association = await _associationRepository.GetByIdAsync(request.AssociationId, cancellationToken);
            if (association == null)
            {
                return Maybe<List<EventSummaryDto>>.None;
            }

            // Get all events for this association
            var events = await _eventRepository.GetByAssociationIdAsync(request.AssociationId, cancellationToken);

            // Filter for upcoming if requested
            if (request.UpcomingOnly)
            {
                var now = DateTime.UtcNow;
                events = events.Where(e => e.StartDate > now && e.Status == EventStatus.Published).ToList();
            }

            // Map to DTOs
            var eventDtos = events.Select(e => new EventSummaryDto(
                e.Id,
                e.Title,
                e.Slug,
                e.Description,
                e.CoverImageUrl,
                e.StartDate,
                e.EndDate,
                e.Location,
                e.Category,
                e.Tags,
                e.IsFeatured,
                e.Price,
                e.IsFree,
                e.Status.ToString(),
                e.AttendeesCount,
                e.AssociationName,
                e.AssociationLogo,
                e.Type.ToString(),
                e.AssociationId
            )).ToList();

            return eventDtos;
        }
    }
} 