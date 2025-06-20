using System;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Common;
using ConnectCampus.Domain.Common.Results;
using ConnectCampus.Domain.Entities;

namespace ConnectCampus.Application.Features.Announcements.Commands.CreateAnnouncement
{
    public class CreateAnnouncementCommandHandler : ICommandHandler<CreateAnnouncementCommand, Guid>
    {
        private readonly IAnnouncementRepository _announcementRepository;
        private readonly IAssociationRepository _associationRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IS3Handler _storageService;
        
        public CreateAnnouncementCommandHandler(
            IAnnouncementRepository announcementRepository,
            IAssociationRepository associationRepository,
            IUnitOfWork unitOfWork,
            IS3Handler storageService)
        {
            _announcementRepository = announcementRepository;
            _associationRepository = associationRepository;
            _unitOfWork = unitOfWork;
            _storageService = storageService;
        }
        
        public async Task<Result<Guid>> Handle(CreateAnnouncementCommand request, CancellationToken cancellationToken)
        {
            // Check if association exists
            var association = await _associationRepository.GetByIdAsync(request.AssociationId, cancellationToken);
            if (association == null)
            {
                return Result.Failure<Guid>(ValidationErrors.Association.NotFound);
            }
            
            string? imageUrl = null;
            if (request.Image != null)
            {
                var imagePath = ConnectCampus.Domain.Common.StoragePaths.AnnouncementImage();
                var uploadResult = await _storageService.UploadAsync(imagePath, request.Image, cancellationToken);
                if (!uploadResult.IsSuccess)
                {
                    return Result.Failure<Guid>(uploadResult.Error);
                }
                imageUrl = imagePath;
            }
            
            // Create announcement
            var announcementId = Guid.NewGuid();
            var announcement = new Announcement(
                announcementId,
                request.AssociationId,
                request.Title,
                request.Content,
                imageUrl,
                request.EventId
            );
            
            _announcementRepository.Add(announcement);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            
            return Result.Success(announcementId);
        }
    }
} 