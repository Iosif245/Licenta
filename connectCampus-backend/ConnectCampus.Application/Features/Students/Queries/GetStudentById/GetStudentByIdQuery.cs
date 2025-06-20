using System;
using ConnectCampus.Application.Abstractions.Messaging;

namespace ConnectCampus.Application.Features.Students.Queries.GetStudentById;

public record GetStudentByIdQuery(Guid Id) : IQuery<StudentDto>; 