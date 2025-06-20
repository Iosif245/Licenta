using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Common;
using ConnectCampus.Domain.Common.Results;
using ConnectCampus.Domain.Entities;

namespace ConnectCampus.Application.Features.Events.Commands.CreateEvent
{
    public class CreateEventCommandHandler : ICommandHandler<CreateEventCommand, Guid>
    {
        private readonly IEventRepository _eventRepository;
        private readonly IAssociationRepository _associationRepository;
        private readonly ISlugGenerator _slugGenerator;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IS3Handler _storageService;

        public CreateEventCommandHandler(
            IEventRepository eventRepository,
            IAssociationRepository associationRepository,
            ISlugGenerator slugGenerator,
            IUnitOfWork unitOfWork,
            IS3Handler storageService)
        {
            _eventRepository = eventRepository;
            _associationRepository = associationRepository;
            _slugGenerator = slugGenerator;
            _unitOfWork = unitOfWork;
            _storageService = storageService;
        }

        public async Task<Result<Guid>> Handle(CreateEventCommand request, CancellationToken cancellationToken)
        {
            // Check if association exists
            var association = await _associationRepository.GetByIdAsync(request.AssociationId, cancellationToken);
            if (association is null)
            {
                return Result.Failure<Guid>(ValidationErrors.Association.NotFound);
            }
            

            var coverImageStoragePath = StoragePaths.EventImage();
            var uploadResult = await _storageService.UploadAsync(coverImageStoragePath, request.CoverImage!, cancellationToken);
                
            if (!uploadResult.IsSuccess)
            {
                return Result.Failure<Guid>(uploadResult.Error);
            }

            // Generate slug from title
            var baseSlug = _slugGenerator.Generate(request.Title);
            var slug = baseSlug;
            var counter = 1;
            
            // Ensure slug uniqueness
            while (await _eventRepository.ExistsBySlugAsync(slug, cancellationToken))
            {
                slug = $"{baseSlug}-{counter}";
                counter++;
            }

            // Create the event
            var eventEntity = new Event(
                Guid.NewGuid(),
                request.AssociationId,
                request.Title,
                coverImageStoragePath,
                slug,
                request.Description,
                request.StartDate,
                request.EndDate,
                request.Timezone,
                request.Location,
                request.Category,
                request.Tags ?? new List<string>(),
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
                association.Name,
                association.Logo,
                request.Type,
                request.MaxAttendees);

            // Persist to database
            _eventRepository.Add(eventEntity);
            
            // Update the association's events count
            association.UpdateStats();
            
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success(eventEntity.Id);
        }
    }
} 