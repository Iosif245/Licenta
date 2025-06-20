using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Announcements.Commands.DeleteAnnouncement
{
    public class DeleteAnnouncementCommandHandler : ICommandHandler<DeleteAnnouncementCommand, bool>
    {
        private readonly IAnnouncementRepository _announcementRepository;
        private readonly IUnitOfWork _unitOfWork;
        
        public DeleteAnnouncementCommandHandler(
            IAnnouncementRepository announcementRepository,
            IUnitOfWork unitOfWork)
        {
            _announcementRepository = announcementRepository;
            _unitOfWork = unitOfWork;
        }
        
        public async Task<Result<bool>> Handle(DeleteAnnouncementCommand request, CancellationToken cancellationToken)
        {
            var announcement = await _announcementRepository.GetByIdAsync(request.Id, cancellationToken);
            if (announcement == null)
            {
                return Result.Failure<bool>(ValidationErrors.Announcement.NotFound);
            }
            
            _announcementRepository.Remove(announcement);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            
            return Result.Success(true);
        }
    }
} 