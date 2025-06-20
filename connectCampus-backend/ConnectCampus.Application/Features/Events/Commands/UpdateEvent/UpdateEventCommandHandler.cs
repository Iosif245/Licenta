using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Common;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Common;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Events.Commands.UpdateEvent
{
    public class UpdateEventCommandHandler : ICommandHandler<UpdateEventCommand, bool>
    {
        private readonly IEventRepository _eventRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IS3Handler _storageService;

        public UpdateEventCommandHandler(
            IEventRepository eventRepository,
            IUnitOfWork unitOfWork,
            IS3Handler storageService)
        {
            _eventRepository = eventRepository;
            _unitOfWork = unitOfWork;
            _storageService = storageService;
        }

        public async Task<Result<bool>> Handle(UpdateEventCommand request, CancellationToken cancellationToken)
        {
            var existingEvent = await _eventRepository.GetByIdAsync(request.Id, cancellationToken);
            
            if (existingEvent is null)
            {
                return Result.Failure<bool>(ValidationErrors.Event.NotFound);
            }
            
            // Validate dates
            if (request.StartDate >= request.EndDate)
            {
                return Result.Failure<bool>(ValidationErrors.Event.InvalidDateRange);
            }
            
            if (request.RegistrationDeadline.HasValue && request.RegistrationDeadline.Value >= request.StartDate)
            {
                return Result.Failure<bool>(ValidationErrors.Event.RegistrationDeadlineAfterStartDate);
            }

            if (request.CoverImage != null)
            {
                var coverPath = StoragePaths.EventImage(existingEvent.CoverImageUrl);
                var uploadResult = await _storageService.UploadAsync(coverPath, request.CoverImage, cancellationToken);
                
                if (!uploadResult.IsSuccess)
                {
                    return Result.Failure<bool>(uploadResult.Error);
                }
                
                existingEvent.UpdateCoverImage(coverPath);
            }
            
            // Update the event
            existingEvent.Update(
                request.Title,
                request.Description,
                request.StartDate,
                request.EndDate,
                request.Timezone,
                request.Location,
                request.Category,
                request.Tags ?? existingEvent.Tags,
                request.Capacity,
                request.IsPublic,
                request.IsFeatured,
                request.RegistrationRequired,
                request.RegistrationDeadline,
                request.RegistrationUrl ?? string.Empty,
                request.Price,
                request.IsFree,
                request.PaymentMethod ?? string.Empty,
                request.ContactEmail ?? string.Empty,
                request.Status,
                request.Type,
                request.MaxAttendees
            );
            
            _eventRepository.Update(existingEvent);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            
            return Result.Success(true);
        }
    }
} 