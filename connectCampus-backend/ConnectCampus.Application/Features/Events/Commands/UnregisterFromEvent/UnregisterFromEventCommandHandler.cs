using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Common;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Events.Commands.UnregisterFromEvent
{
    public class UnregisterFromEventCommandHandler : ICommandHandler<UnregisterFromEventCommand, bool>
    {
        private readonly IStudentEventRegistrationRepository _registrationRepository;
        private readonly IUnitOfWork _unitOfWork;

        public UnregisterFromEventCommandHandler(
            IStudentEventRegistrationRepository registrationRepository,
            IUnitOfWork unitOfWork)
        {
            _registrationRepository = registrationRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<bool>> Handle(UnregisterFromEventCommand request, CancellationToken cancellationToken)
        {
            // Check if registration exists
            var registration = await _registrationRepository.GetByStudentAndEventAsync(
                request.StudentId, request.EventId, cancellationToken);
            
            if (registration is null)
            {
                return Result.Failure<bool>(ValidationErrors.Event.NotRegistered);
            }

            // Remove registration
            _registrationRepository.Remove(registration);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success(true);
        }
    }
} 