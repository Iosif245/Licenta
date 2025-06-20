using System;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Common;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Common.Results;
using ConnectCampus.Domain.Entities;
using ConnectCampus.Domain.Enums;

namespace ConnectCampus.Application.Features.Events.Commands.RegisterForEvent
{
    public class RegisterForEventCommandHandler : ICommandHandler<RegisterForEventCommand, Guid>
    {
        private readonly IStudentEventRegistrationRepository _registrationRepository;
        private readonly IStudentRepository _studentRepository;
        private readonly IEventRepository _eventRepository;
        private readonly IUnitOfWork _unitOfWork;

        public RegisterForEventCommandHandler(
            IStudentEventRegistrationRepository registrationRepository,
            IStudentRepository studentRepository,
            IEventRepository eventRepository,
            IUnitOfWork unitOfWork)
        {
            _registrationRepository = registrationRepository;
            _studentRepository = studentRepository;
            _eventRepository = eventRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<Guid>> Handle(RegisterForEventCommand request, CancellationToken cancellationToken)
        {
            // Check if student exists
            var student = await _studentRepository.GetByIdAsync(request.StudentId, cancellationToken);
            if (student is null)
            {
                return Result.Failure<Guid>(ValidationErrors.Student.NotFound);
            }

            // Check if event exists
            var eventEntity = await _eventRepository.GetByIdAsync(request.EventId, cancellationToken);
            if (eventEntity is null)
            {
                return Result.Failure<Guid>(ValidationErrors.Event.NotFound);
            }

            // Check if event is published and registration is allowed
            if (eventEntity.Status != EventStatus.Published)
            {
                return Result.Failure<Guid>(ValidationErrors.Event.NotPublished);
            }

            // Check registration deadline
            if (eventEntity.RegistrationDeadline.HasValue && DateTime.UtcNow > eventEntity.RegistrationDeadline.Value)
            {
                return Result.Failure<Guid>(ValidationErrors.Event.RegistrationDeadlinePassed);
            }

            // Check if already registered
            var existingRegistration = await _registrationRepository.ExistsByStudentAndEventAsync(
                request.StudentId, request.EventId, cancellationToken);
            
            if (existingRegistration)
            {
                return Result.Failure<Guid>(ValidationErrors.Event.AlreadyRegistered);
            }

            // Check capacity
            if (eventEntity.MaxAttendees.HasValue)
            {
                var currentRegistrations = await _registrationRepository.GetRegistrationCountByEventIdAsync(
                    request.EventId, cancellationToken);
                
                if (currentRegistrations >= eventEntity.MaxAttendees.Value)
                {
                    return Result.Failure<Guid>(ValidationErrors.Event.CapacityReached);
                }
            }

            // Create registration
            var registration = new StudentEventRegistration(request.StudentId, request.EventId);
            
            _registrationRepository.Add(registration);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success(registration.Id);
        }
    }
} 