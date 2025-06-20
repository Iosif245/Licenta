using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Common;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Events.Commands.RemoveEventFromFavorites
{
    public class RemoveEventFromFavoritesCommandHandler : ICommandHandler<RemoveEventFromFavoritesCommand, bool>
    {
        private readonly IStudentFavoriteEventRepository _favoriteRepository;
        private readonly IUnitOfWork _unitOfWork;

        public RemoveEventFromFavoritesCommandHandler(
            IStudentFavoriteEventRepository favoriteRepository,
            IUnitOfWork unitOfWork)
        {
            _favoriteRepository = favoriteRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<bool>> Handle(RemoveEventFromFavoritesCommand request, CancellationToken cancellationToken)
        {
            // Check if favorite exists
            var favorite = await _favoriteRepository.GetByStudentAndEventAsync(
                request.StudentId, request.EventId, cancellationToken);
            
            if (favorite is null)
            {
                return Result.Failure<bool>(ValidationErrors.Event.NotFavorited);
            }

            // Remove favorite
            _favoriteRepository.Remove(favorite);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success(true);
        }
    }
} 