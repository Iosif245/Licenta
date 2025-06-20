using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Features.Students;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Students.Queries.GetStudentById;

public class GetStudentByIdQueryHandler : IQueryHandler<GetStudentByIdQuery, StudentDto>
{
    private readonly IStudentRepository _studentRepository;

    public GetStudentByIdQueryHandler(IStudentRepository studentRepository)
    {
        _studentRepository = studentRepository;
    }

    public async Task<Maybe<StudentDto>> Handle(GetStudentByIdQuery request, CancellationToken cancellationToken)
    {
        var student = await _studentRepository.GetByIdAsync(request.Id, cancellationToken);

        if (student is null)
        {
            return Maybe<StudentDto>.None;
        }

        var response = new StudentDto(
            student.Id,
            student.UserId,
            student.Email,
            student.JoinedDate,
            student.FirstName,
            student.LastName,
            student.Bio,
            student.AvatarUrl,
            student.University,
            student.Faculty,
            student.Specialization,
            student.StudyYear,
            student.EducationLevel,
            student.LinkedInUrl,
            student.GitHubUrl,
            student.FacebookUrl,
            student.Interests,
            student.FavoriteEvents.Select(fe => fe.EventId),
            student.EventRegistrations.Select(er => er.EventId),
            student.CreatedAt,
            student.UpdatedAt);

        return response;
    }
} 