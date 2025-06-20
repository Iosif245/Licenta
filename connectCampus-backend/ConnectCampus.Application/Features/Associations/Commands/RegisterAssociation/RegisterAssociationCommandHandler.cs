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

namespace ConnectCampus.Application.Features.Associations.Commands.RegisterAssociation
{
    public class RegisterAssociationCommandHandler : ICommandHandler<RegisterAssociationCommand, Guid>
    {
        private readonly IUserRepository _userRepository;
        private readonly IAssociationRepository _associationRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IDateTimeMachine _dateTimeMachine;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IS3Handler _storageService;

        public RegisterAssociationCommandHandler(
            IUserRepository userRepository,
            IAssociationRepository associationRepository,
            IPasswordHasher passwordHasher,
            IDateTimeMachine dateTimeMachine,
            IUnitOfWork unitOfWork,
            IS3Handler storageService)
        {
            _userRepository = userRepository;
            _associationRepository = associationRepository;
            _passwordHasher = passwordHasher;
            _dateTimeMachine = dateTimeMachine;
            _unitOfWork = unitOfWork;
            _storageService = storageService;
        }

        public async Task<Result<Guid>> Handle(RegisterAssociationCommand request, CancellationToken cancellationToken)
        {
            // Check if user already exists
            var existingUser = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
            if (existingUser != null)
            {
                return Result.Failure<Guid>(ValidationErrors.Auth.UserAlreadyExists);
            }

            // Check if association name already exists
            var existingAssociation = await _associationRepository.ExistsByNameAsync(request.Name, cancellationToken);
            if (existingAssociation)
            {
                return Result.Failure<Guid>(ValidationErrors.Association.AlreadyExists);
            }

            // Handle logo upload
            var logoPath = StoragePaths.Avatar();
            var logoUploadResult = await _storageService.UploadAsync(logoPath, request.Logo, cancellationToken);
            
            if (!logoUploadResult.IsSuccess)
            {
                return Result.Failure<Guid>(logoUploadResult.Error);
            }

            // Handle cover image upload
            var coverPath = StoragePaths.Cover();
            var coverUploadResult = await _storageService.UploadAsync(coverPath, request.CoverImage, cancellationToken);
            
            if (!coverUploadResult.IsSuccess)
            {
                return Result.Failure<Guid>(coverUploadResult.Error);
            }

            // Create User entity
            var passwordHash = _passwordHasher.HashPassword(request.Password);
            var user = new User(
                request.Email,
                passwordHash,
                UserRole.Association,
                _dateTimeMachine.UtcNow);

            _userRepository.Add(user);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Generate slug from name
            var slug = GenerateSlug(request.Name);
            
            // Ensure slug uniqueness
            var originalSlug = slug;
            var counter = 1;
            while (await _associationRepository.ExistsBySlugAsync(slug, cancellationToken))
            {
                slug = $"{originalSlug}-{counter}";
                counter++;
            }

            // Create Association entity
            var association = new Association(
                user.Id,
                request.Name,
                slug,
                request.Description,
                logoPath,
                coverPath,
                request.Category,
                request.FoundedYear,
                request.Email);

            // Update optional fields if provided
            if (!string.IsNullOrEmpty(request.Location) ||
                !string.IsNullOrEmpty(request.Website) ||
                !string.IsNullOrEmpty(request.Phone) ||
                !string.IsNullOrEmpty(request.Address) ||
                !string.IsNullOrEmpty(request.Facebook) ||
                !string.IsNullOrEmpty(request.Twitter) ||
                !string.IsNullOrEmpty(request.Instagram) ||
                !string.IsNullOrEmpty(request.LinkedIn))
            {
                association.UpdateContactInfo(
                    request.Location,
                    request.Website,
                    request.Phone,
                    request.Address,
                    request.Facebook,
                    request.Twitter,
                    request.Instagram,
                    request.LinkedIn);
            }

            _associationRepository.Add(association);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success(association.Id);
        }

        private string GenerateSlug(string name)
        {
            return name.ToLowerInvariant()
                      .Replace(" ", "-")
                      .Replace("&", "and")
                      .Replace("'", "")
                      .Replace(".", "")
                      .Replace(",", "")
                      .Replace("!", "")
                      .Replace("?", "")
                      .Replace("(", "")
                      .Replace(")", "");
        }
    }
} 