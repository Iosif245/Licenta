using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Common;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Students.Commands.UpdateStudent
{
    public class UpdateStudentCommandHandler : ICommandHandler<UpdateStudentCommand, bool>
    {
        private readonly IStudentRepository _studentRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IS3Handler _storageService;

        public UpdateStudentCommandHandler(
            IStudentRepository studentRepository,
            IUnitOfWork unitOfWork,
            IS3Handler storageService)
        {
            _studentRepository = studentRepository;
            _unitOfWork = unitOfWork;
            _storageService = storageService;
        }

        public async Task<Result<bool>> Handle(UpdateStudentCommand request, CancellationToken cancellationToken)
        {
            var student = await _studentRepository.GetByIdAsync(request.Id, cancellationToken);

            if (student is null)
            {
                return Result.Failure<bool>(ValidationErrors.Student.NotFound);
            }

            // Handle avatar upload if provided
            if (request.Avatar != null)
            {
                var avatarPath = StoragePaths.Avatar(student.AvatarUrl);
                var uploadResult = await _storageService.UploadAsync(avatarPath, request.Avatar, cancellationToken);
                
                if (!uploadResult.IsSuccess)
                {
                    return Result.Failure<bool>(uploadResult.Error);
                }
                
                student.UpdateAvatar(avatarPath);
            }

            student.UpdateProfile(
                request.FirstName,
                request.LastName,
                request.Bio,
                request.University,
                request.Faculty,
                request.Specialization,
                request.StudyYear,
                request.EducationLevel,
                request.LinkedInUrl,
                request.GitHubUrl,
                request.FacebookUrl);

            _studentRepository.Update(student);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success(true);
        }
    }
} 