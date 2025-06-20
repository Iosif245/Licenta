using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Common;
using ConnectCampus.Domain.Common.Results;
using ConnectCampus.Domain.Common.Time;
using ConnectCampus.Domain.Entities;

namespace ConnectCampus.Application.Features.Users.Register;

public class RegisterUserCommandHandler : ICommandHandler<RegisterUserCommand, Guid>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IDateTimeMachine _dateTimeMachine;

    public RegisterUserCommandHandler(
        IUnitOfWork unitOfWork,
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IDateTimeMachine dateTimeMachine)
    {
        _unitOfWork = unitOfWork;
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _dateTimeMachine = dateTimeMachine;
    }

    public async Task<Result<Guid>> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        var existingUserByEmail = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
        
        if (existingUserByEmail != null)
        {
            return Result.Failure<Guid>(ValidationErrors.Auth.UserAlreadyExists);
        }

        var passwordHash = _passwordHasher.HashPassword(request.Password);
        var userRole = UserRole.FromName(request.Role)!;

        var user = new User(
            request.Email,
            passwordHash,
            userRole,
            _dateTimeMachine.UtcNow);
        
        _userRepository.Add(user);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        
        return Result.Success(user.Id);
    }
}