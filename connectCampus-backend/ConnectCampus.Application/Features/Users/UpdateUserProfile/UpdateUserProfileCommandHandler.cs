/*using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Common;
using ConnectCampus.Domain.Common.Results;
using ConnectCampus.Domain.Common.Time;

namespace ConnectCampus.Application.Features.Users.UpdateUserProfile;

public class UpdateUserProfileCommandHandler : ICommandHandler<UpdateUserProfileCommand>
{
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IDateTimeMachine _dateTime;
    private readonly ICurrentUserService _currentUserService;

    public UpdateUserProfileCommandHandler(IUserRepository userRepository, IUnitOfWork unitOfWork, IDateTimeMachine dateTime, ICurrentUserService currentUserService)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _dateTime = dateTime;
        _currentUserService = currentUserService;
    }

    public async Task<Result> Handle(UpdateUserProfileCommand request, CancellationToken cancellationToken)
    {
        if (!_currentUserService.IsAuthenticated)
        {
            return Result.Failure(ValidationErrors.User.NotAuthenticated);
        }
        if (_currentUserService.UserId != request.UserId)
        {
            return Result.Failure(ValidationErrors.User.IdNotMatched);
        }
        
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if (user == null)
        {
            return Result.Failure(ValidationErrors.User.NotFound);   
        }

        user.Update(
            request.FirstName,
            request.LastName,
            request.Location,
            request.PhoneNumber,
            _dateTime.UtcNow);

        if (request.Bio != null && user.Role.Value == UserRole.Association.Value)
        {
            user.UpdateBio(request.Bio, _dateTime.UtcNow);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
} */