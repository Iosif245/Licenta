using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Features.Events.Dtos;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Events.Queries.GetStudentEventRegistrations
{
    public class GetStudentEventRegistrationsQueryHandler : IQueryHandler<GetStudentEventRegistrationsQuery, List<EventRegistrationDto>>
    {
        private readonly IStudentEventRegistrationRepository _registrationRepository;

        public GetStudentEventRegistrationsQueryHandler(IStudentEventRegistrationRepository registrationRepository)
        {
            _registrationRepository = registrationRepository;
        }

        public async Task<Maybe<List<EventRegistrationDto>>> Handle(GetStudentEventRegistrationsQuery request, CancellationToken cancellationToken)
        {
            var registrations = await _registrationRepository.GetByStudentIdAsync(request.StudentId, cancellationToken);

            var paginatedRegistrations = registrations
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToList();

            var result = paginatedRegistrations.Select(r => new EventRegistrationDto(
                r.Id,
                r.StudentId,
                r.EventId,
                r.RegisteredAt,
                r.IsAttended,
                new EventSummaryDto(
                    r.Event.Id,
                    r.Event.Title,
                    r.Event.Slug,
                    r.Event.Description,
                    r.Event.CoverImageUrl,
                    r.Event.StartDate,
                    r.Event.EndDate,
                    r.Event.Location,
                    r.Event.Category,
                    r.Event.Tags,
                    r.Event.IsFeatured,
                    r.Event.Price,
                    r.Event.IsFree,
                    r.Event.Status.ToString(),
                    r.Event.AttendeesCount,
                    r.Event.AssociationName,
                    r.Event.AssociationLogo,
                    r.Event.Type.ToString(),
                    r.Event.AssociationId
                )
            )).ToList();

            return result;
        }
    }
} 