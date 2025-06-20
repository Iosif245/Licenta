using System;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Common.Results;
using ConnectCampus.Domain.Entities;
using ConnectCampus.Domain.Enums;

namespace ConnectCampus.Application.Features.Announcements.Commands.AddComment
{
    public class AddCommentCommandHandler : ICommandHandler<AddCommentCommand, Guid>
    {
        private readonly IAnnouncementRepository _announcementRepository;
        private readonly IAnnouncementCommentRepository _commentRepository;
        private readonly IStudentRepository _studentRepository;
        private readonly IAssociationRepository _associationRepository;
        private readonly IUnitOfWork _unitOfWork;

        public AddCommentCommandHandler(
            IAnnouncementRepository announcementRepository,
            IAnnouncementCommentRepository commentRepository,
            IStudentRepository studentRepository,
            IAssociationRepository associationRepository,
            IUnitOfWork unitOfWork)
        {
            _announcementRepository = announcementRepository;
            _commentRepository = commentRepository;
            _studentRepository = studentRepository;
            _associationRepository = associationRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<Guid>> Handle(AddCommentCommand request, CancellationToken cancellationToken)
        {
            // Check if announcement exists
            var announcementExists = await _announcementRepository.ExistsByIdAsync(request.AnnouncementId, cancellationToken);
            if (!announcementExists)
            {
                return Result.Failure<Guid>(ValidationErrors.Announcement.NotFound);
            }

            // Validate author exists based on AuthorType
            if (request.AuthorType == AuthorType.Student)
            {
                var studentExists = await _studentRepository.ExistsByIdAsync(request.AuthorId, cancellationToken);
                if (!studentExists)
                {
                    return Result.Failure<Guid>(ValidationErrors.Student.NotFound);
                }
            }
            else if (request.AuthorType == AuthorType.Association)
            {
                var associationExists = await _associationRepository.ExistsByIdAsync(request.AuthorId, cancellationToken);
                if (!associationExists)
                {
                    return Result.Failure<Guid>(ValidationErrors.Association.NotFound);
                }
            }

            // If it's a reply, check if parent comment exists
            if (request.ParentCommentId.HasValue)
            {
                var parentComment = await _commentRepository.GetByIdAsync(request.ParentCommentId.Value, cancellationToken);
                if (parentComment == null || parentComment.AnnouncementId != request.AnnouncementId)
                {
                    return Result.Failure<Guid>(ValidationErrors.Comment.ParentNotFound);
                }
            }

            // Create the comment
            var comment = new AnnouncementComment(
                request.AnnouncementId,
                request.AuthorId,
                request.AuthorType,
                request.Content,
                request.ParentCommentId);

            _commentRepository.Add(comment);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success(comment.Id);
        }
    }
} 