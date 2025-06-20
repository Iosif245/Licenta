using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Common.Results;
using ConnectCampus.Domain.Entities;
using ConnectCampus.Domain.Enums;

namespace ConnectCampus.Application.Features.Announcements.Commands.LikeAnnouncement
{
    public class LikeAnnouncementCommandHandler : ICommandHandler<LikeAnnouncementCommand, bool>
    {
        private readonly IAnnouncementRepository _announcementRepository;
        private readonly IAnnouncementLikeRepository _likeRepository;
        private readonly IStudentRepository _studentRepository;
        private readonly IAssociationRepository _associationRepository;
        private readonly IUnitOfWork _unitOfWork;

        public LikeAnnouncementCommandHandler(
            IAnnouncementRepository announcementRepository,
            IAnnouncementLikeRepository likeRepository,
            IStudentRepository studentRepository,
            IAssociationRepository associationRepository,
            IUnitOfWork unitOfWork)
        {
            _announcementRepository = announcementRepository;
            _likeRepository = likeRepository;
            _studentRepository = studentRepository;
            _associationRepository = associationRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<bool>> Handle(LikeAnnouncementCommand request, CancellationToken cancellationToken)
        {
            // Check if announcement exists
            var announcementExists = await _announcementRepository.ExistsByIdAsync(request.AnnouncementId, cancellationToken);
            if (!announcementExists)
            {
                return Result.Failure<bool>(ValidationErrors.Announcement.NotFound);
            }

            // Validate author exists based on AuthorType
            if (request.AuthorType == AuthorType.Student)
            {
                var studentExists = await _studentRepository.ExistsByIdAsync(request.AuthorId, cancellationToken);
                if (!studentExists)
                {
                    return Result.Failure<bool>(ValidationErrors.Student.NotFound);
                }
            }
            else if (request.AuthorType == AuthorType.Association)
            {
                var associationExists = await _associationRepository.ExistsByIdAsync(request.AuthorId, cancellationToken);
                if (!associationExists)
                {
                    return Result.Failure<bool>(ValidationErrors.Association.NotFound);
                }
            }

            // Check if already liked
            var existingLike = await _likeRepository.GetByAnnouncementAndAuthorAsync(
                request.AnnouncementId,
                request.AuthorId,
                request.AuthorType,
                cancellationToken);

            if (existingLike != null)
            {
                // Unlike - remove the like
                _likeRepository.Remove(existingLike);
            }
            else
            {
                // Like - add new like
                var like = new AnnouncementLike(
                    request.AnnouncementId,
                    request.AuthorId,
                    request.AuthorType);

                _likeRepository.Add(like);
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result.Success(existingLike == null); // true if liked, false if unliked
        }
    }
} 