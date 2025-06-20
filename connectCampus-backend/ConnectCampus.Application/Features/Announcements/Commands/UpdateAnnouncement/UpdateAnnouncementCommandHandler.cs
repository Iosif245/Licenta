using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Common;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Announcements.Commands.UpdateAnnouncement
{
    public class UpdateAnnouncementCommandHandler : ICommandHandler<UpdateAnnouncementCommand, bool>
    {
        private readonly IAnnouncementRepository _announcementRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IS3Handler _s3Handler;
        
        public UpdateAnnouncementCommandHandler(
            IAnnouncementRepository announcementRepository,
            IUnitOfWork unitOfWork,
            IS3Handler s3Handler)
        {
            _announcementRepository = announcementRepository;
            _unitOfWork = unitOfWork;
            _s3Handler = s3Handler;
        }
        
        public async Task<Result<bool>> Handle(UpdateAnnouncementCommand request, CancellationToken cancellationToken)
        {
            var announcement = await _announcementRepository.GetByIdAsync(request.Id, cancellationToken);
            if (announcement == null)
            {
                return Result.Failure<bool>(ValidationErrors.Announcement.NotFound);
            }
            
            string? imageUrl = announcement.ImageUrl; // Keep existing image URL by default
            
            // If a new image is provided, upload it to S3
            if (request.Image != null)
            {
                var imagePath = StoragePaths.AnnouncementImage(announcement.ImageUrl);
                var uploadResult = await _s3Handler.UploadAsync(imagePath, request.Image, cancellationToken);
                if (!uploadResult.IsSuccess)
                {
                    return Result.Failure<bool>(uploadResult.Error);
                }
                imageUrl = imagePath;
            }
            
            announcement.Update(
                request.Title,
                request.Content,
                imageUrl
            );
            
            _announcementRepository.Update(announcement);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            
            return Result.Success(true);
        }
    }
} 