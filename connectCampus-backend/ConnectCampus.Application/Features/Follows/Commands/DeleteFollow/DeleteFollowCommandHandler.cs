using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Common;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Follows.Commands.DeleteFollow
{
    public class DeleteFollowCommandHandler : ICommandHandler<DeleteFollowCommand, bool>
    {
        private readonly IFollowRepository _followRepository;
        private readonly IAssociationRepository _associationRepository;
        private readonly IUnitOfWork _unitOfWork;

        public DeleteFollowCommandHandler(
            IFollowRepository followRepository,
            IAssociationRepository associationRepository,
            IUnitOfWork unitOfWork)
        {
            _followRepository = followRepository;
            _associationRepository = associationRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<bool>> Handle(DeleteFollowCommand request, CancellationToken cancellationToken)
        {
            // Check if the follow relationship exists
            var follow = await _followRepository.GetAsync(request.StudentId, request.AssociationId, cancellationToken);
            
            if (follow is null)
            {
                // Not following, return success
                return Result.Success(true);
            }

            // Get the association to update its stats
            var association = await _associationRepository.GetByIdAsync(request.AssociationId, cancellationToken);
            if (association is null)
            {
                return Result.Failure<bool>(ValidationErrors.Association.NotFound);
            }

            // Remove the follow relationship
            _followRepository.Remove(follow);

            // Manually calculate the new follower count after removal
            var currentFollowerCount = await _followRepository.GetFollowersCountByAssociationIdAsync(request.AssociationId, cancellationToken);
            var newFollowerCount = currentFollowerCount - 1;
            
            // Update the association's follower count directly
            association.UpdateFollowerCount(newFollowerCount);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success(true);
        }
    }
} 