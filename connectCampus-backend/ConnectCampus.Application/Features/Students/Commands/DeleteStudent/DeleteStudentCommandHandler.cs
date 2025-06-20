using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Students.Commands.DeleteStudent
{
    public class DeleteStudentCommandHandler : ICommandHandler<DeleteStudentCommand, bool>
    {
        private readonly IStudentRepository _studentRepository;
        private readonly IUnitOfWork _unitOfWork;

        public DeleteStudentCommandHandler(
            IStudentRepository studentRepository,
            IUnitOfWork unitOfWork)
        {
            _studentRepository = studentRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<bool>> Handle(DeleteStudentCommand request, CancellationToken cancellationToken)
        {
            var student = await _studentRepository.GetByIdAsync(request.Id, cancellationToken);

            if (student is null)
            {
                return Result.Failure<bool>(ValidationErrors.Student.NotFound);
            }

            _studentRepository.Remove(student);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success(true);
        }
    }
} 