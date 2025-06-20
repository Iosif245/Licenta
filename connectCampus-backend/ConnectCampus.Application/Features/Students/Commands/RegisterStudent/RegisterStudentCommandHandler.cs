using System;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Common;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Common;
using ConnectCampus.Domain.Common.Results;
using ConnectCampus.Domain.Common.Time;
using ConnectCampus.Domain.Entities;

namespace ConnectCampus.Application.Features.Students.Commands.RegisterStudent
{
    public class RegisterStudentCommandHandler : ICommandHandler<RegisterStudentCommand, Guid>
    {
        private readonly IUserRepository _userRepository;
        private readonly IStudentRepository _studentRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IDateTimeMachine _dateTimeMachine;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IS3Handler _storageService;

        public RegisterStudentCommandHandler(
            IUserRepository userRepository,
            IStudentRepository studentRepository,
            IPasswordHasher passwordHasher,
            IDateTimeMachine dateTimeMachine,
            IUnitOfWork unitOfWork,
            IS3Handler storageService)
        {
            _userRepository = userRepository;
            _studentRepository = studentRepository;
            _passwordHasher = passwordHasher;
            _dateTimeMachine = dateTimeMachine;
            _unitOfWork = unitOfWork;
            _storageService = storageService;
        }

        public async Task<Result<Guid>> Handle(RegisterStudentCommand request, CancellationToken cancellationToken)
        {
            // Check if user already exists
            var existingUser = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
            if (existingUser != null)
            {
                return Result.Failure<Guid>(ValidationErrors.Auth.UserAlreadyExists);
            }

            // Handle avatar upload (required for registration)
            var avatarPath = StoragePaths.Avatar();
            var uploadResult = await _storageService.UploadAsync(avatarPath, request.Avatar, cancellationToken);
            
            if (!uploadResult.IsSuccess)
            {
                return Result.Failure<Guid>(uploadResult.Error);
            }

            // Create User entity
            var passwordHash = _passwordHasher.HashPassword(request.Password);
            var user = new User(
                request.Email,
                passwordHash,
                UserRole.Student,
                _dateTimeMachine.UtcNow);

            _userRepository.Add(user);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Create Student entity
            var student = new Student(
                user.Id,
                request.Email,
                request.FirstName,
                request.LastName,
                request.University,
                request.Faculty,
                request.Specialization,
                request.StudyYear,
                request.EducationLevel);

            // Update avatar with uploaded path
            student.UpdateAvatar(avatarPath);

            _studentRepository.Add(student);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success(student.Id);
        }
    }
} 