using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Common;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Events.Commands.DeleteEvent
{
    public class DeleteEventCommandHandler : ICommandHandler<DeleteEventCommand, bool>
    {
        private readonly IEventRepository _eventRepository;
        private readonly IAssociationRepository _associationRepository;
        private readonly IUnitOfWork _unitOfWork;

        public DeleteEventCommandHandler(
            IEventRepository eventRepository,
            IAssociationRepository associationRepository,
            IUnitOfWork unitOfWork)
        {
            _eventRepository = eventRepository;
            _associationRepository = associationRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<bool>> Handle(DeleteEventCommand request, CancellationToken cancellationToken)
        {
            var existingEvent = await _eventRepository.GetByIdAsync(request.Id, cancellationToken);
            
            if (existingEvent is null)
            {
                return Result.Failure<bool>(ValidationErrors.Event.NotFound);
            }
            
            // Get the association to update its stats
            var association = await _associationRepository.GetByIdAsync(existingEvent.AssociationId, cancellationToken);
            
            if (association is null)
            {
                return Result.Failure<bool>(ValidationErrors.Association.NotFound);
            }
            
            // Remove the event
            _eventRepository.Remove(existingEvent);
            
            // Update the association's events count
            association.UpdateStats();
            
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            
            return Result.Success(true);
        }
    }
} 