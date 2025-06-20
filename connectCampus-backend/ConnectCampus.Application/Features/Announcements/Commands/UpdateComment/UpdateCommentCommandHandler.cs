using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Announcements.Commands.UpdateComment
{
    public class UpdateCommentCommandHandler : ICommandHandler<UpdateCommentCommand, bool>
    {
        private readonly IAnnouncementCommentRepository _commentRepository;
        private readonly IUnitOfWork _unitOfWork;

        public UpdateCommentCommandHandler(
            IAnnouncementCommentRepository commentRepository,
            IUnitOfWork unitOfWork)
        {
            _commentRepository = commentRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<bool>> Handle(UpdateCommentCommand request, CancellationToken cancellationToken)
        {
            var comment = await _commentRepository.GetByIdAsync(request.CommentId, cancellationToken);
            if (comment == null)
            {
                return Result.Failure<bool>(ValidationErrors.Comment.NotFound);
            }

            comment.UpdateContent(request.Content);
            
            _commentRepository.Update(comment);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success(true);
        }
    }
} 
 
 