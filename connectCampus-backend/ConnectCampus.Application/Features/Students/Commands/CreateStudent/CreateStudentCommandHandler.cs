using System;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Common;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Common.Results;
using ConnectCampus.Domain.Entities;

namespace ConnectCampus.Application.Features.Students.Commands.CreateStudent
{
    public class CreateStudentCommandHandler : ICommandHandler<CreateStudentCommand, Guid>
    {
        private readonly IStudentRepository _studentRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CreateStudentCommandHandler(
            IStudentRepository studentRepository,
            IUnitOfWork unitOfWork)
        {
            _studentRepository = studentRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<Guid>> Handle(CreateStudentCommand request, CancellationToken cancellationToken)
        {
            var existingStudent = await _studentRepository.GetByEmailAsync(request.Email, cancellationToken);
            
            if (existingStudent is not null)
            {
                return Result.Failure<Guid>(ValidationErrors.Student.AlreadyExists);
            }

            var student = new Student(
                request.UserId,
                request.Email,
                request.FirstName,
                request.LastName,
                request.University,
                request.Faculty,
                request.Specialization,
                request.StudyYear,
                request.EducationLevel);

            _studentRepository.Add(student);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success(student.Id);
        }
    }
} 