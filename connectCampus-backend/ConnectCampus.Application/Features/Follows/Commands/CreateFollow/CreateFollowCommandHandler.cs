using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Common;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Common.Results;
using ConnectCampus.Domain.Entities;

namespace ConnectCampus.Application.Features.Follows.Commands.CreateFollow
{
    public class CreateFollowCommandHandler : ICommandHandler<CreateFollowCommand, bool>
    {
        private readonly IFollowRepository _followRepository;
        private readonly IStudentRepository _studentRepository;
        private readonly IAssociationRepository _associationRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CreateFollowCommandHandler(
            IFollowRepository followRepository,
            IStudentRepository studentRepository,
            IAssociationRepository associationRepository,
            IUnitOfWork unitOfWork)
        {
            _followRepository = followRepository;
            _studentRepository = studentRepository;
            _associationRepository = associationRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<bool>> Handle(CreateFollowCommand request, CancellationToken cancellationToken)
        {
            // Check if student exists
            var student = await _studentRepository.GetByIdAsync(request.StudentId, cancellationToken);
            if (student is null)
            {
                return Result.Failure<bool>(ValidationErrors.Student.NotFound);
            }

            // Check if association exists
            var association = await _associationRepository.GetByIdAsync(request.AssociationId, cancellationToken);
            if (association is null)
            {
                return Result.Failure<bool>(ValidationErrors.Association.NotFound);
            }

            // Check if already following
            if (await _followRepository.ExistsAsync(request.StudentId, request.AssociationId, cancellationToken))
            {
                // Already following, return success
                return Result.Success(true);
            }

            // Create new follow relationship
            var follow = new Follow(request.StudentId, request.AssociationId);
            _followRepository.Add(follow);

            // Manually calculate the new follower count after addition
            var currentFollowerCount = await _followRepository.GetFollowersCountByAssociationIdAsync(request.AssociationId, cancellationToken);
            var newFollowerCount = currentFollowerCount + 1;
            
            // Update the association's follower count directly
            association.UpdateFollowerCount(newFollowerCount);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success(true);
        }
    }
} 