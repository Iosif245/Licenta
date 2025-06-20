using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Features.Events.Dtos;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Events.Queries.GetEventAttendees;

public class GetEventAttendeesQueryHandler : IQueryHandler<GetEventAttendeesQuery, List<EventAttendeeDto>>
{
    private readonly IStudentEventRegistrationRepository _registrationRepository;
    private readonly IEventRepository _eventRepository;

    public GetEventAttendeesQueryHandler(
        IStudentEventRegistrationRepository registrationRepository,
        IEventRepository eventRepository)
    {
        _registrationRepository = registrationRepository;
        _eventRepository = eventRepository;
    }

    public async Task<Maybe<List<EventAttendeeDto>>> Handle(GetEventAttendeesQuery request, CancellationToken cancellationToken)
    {
        // First check if event exists
        var eventExists = await _eventRepository.GetByIdAsync(request.EventId, cancellationToken);
        if (eventExists is null)
        {
            return Maybe<List<EventAttendeeDto>>.None;
        }

        // Get all registrations for this event
        var registrations = await _registrationRepository.GetByEventIdAsync(request.EventId, cancellationToken);

        var attendees = registrations.Select(r => new EventAttendeeDto(
            r.Id,
            r.StudentId,
            r.Student.FirstName,
            r.Student.LastName,
            r.Student.Email,
            r.Student.EducationLevel.ToString(),
            r.Student.AvatarUrl,
            r.RegisteredAt,
            r.IsAttended
        )).ToList();

        return attendees;
    }
} 