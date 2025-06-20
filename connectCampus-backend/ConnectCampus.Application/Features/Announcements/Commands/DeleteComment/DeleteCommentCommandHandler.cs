using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Announcements.Commands.DeleteComment
{
    public class DeleteCommentCommandHandler : ICommandHandler<DeleteCommentCommand, bool>
    {
        private readonly IAnnouncementCommentRepository _commentRepository;
        private readonly IUnitOfWork _unitOfWork;

        public DeleteCommentCommandHandler(
            IAnnouncementCommentRepository commentRepository,
            IUnitOfWork unitOfWork)
        {
            _commentRepository = commentRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<bool>> Handle(DeleteCommentCommand request, CancellationToken cancellationToken)
        {
            var comment = await _commentRepository.GetByIdAsync(request.CommentId, cancellationToken);
            if (comment == null)
            {
                return Result.Failure<bool>(ValidationErrors.Comment.NotFound);
            }

            _commentRepository.Remove(comment);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success(true);
        }
    }
} 
 
 