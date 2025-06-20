using System;
using System.Threading.Tasks;
using ConnectCampus.Api.Common;
using ConnectCampus.Api.Extensions;
using ConnectCampus.Api.Models.Students;
using ConnectCampus.Application.Features.Students;
using ConnectCampus.Application.Features.Students.Commands.CreateStudent;
using ConnectCampus.Application.Features.Students.Commands.DeleteStudent;
using ConnectCampus.Application.Features.Students.Commands.UpdateStudent;
using ConnectCampus.Application.Features.Students.Commands.UpdateStudentInterests;
using ConnectCampus.Application.Features.Students.Queries.GetStudentById;
using ConnectCampus.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ConnectCampus.Api.Controllers
{
    [Route("api/students")]
    [ApiController]
    public class StudentsController : ApiController
    {
        private readonly IMediator _mediator;

        public StudentsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Get student by ID
        /// </summary>
        [HttpGet("{id}")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Get(Guid id, CancellationToken cancellationToken)
        {
            var query = new GetStudentByIdQuery(id);
            var result = await _mediator.Send(query, cancellationToken);
            return result.Match<StudentDto, IActionResult>(Ok, NotFound);
        }

        /// <summary>
        /// Create a new student
        /// </summary>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create(CreateStudentRequest request)
        {
            var educationLevel = EducationLevel.FromName<EducationLevel>(request.EducationLevel);
            if (educationLevel == null)
            {
                return BadRequest($"Invalid education level: {request.EducationLevel}");
            }

            var command = new CreateStudentCommand(
                request.UserId,
                request.Email,
                request.FirstName,
                request.LastName,
                request.University,
                request.Faculty,
                request.Specialization,
                request.StudyYear,
                educationLevel);

            var result = await _mediator.Send(command);

            return result.Match(
                id => CreatedAtAction(nameof(Get), new { id }, null),
                HandleFailure);
        }

        /// <summary>
        /// Update an existing student
        /// </summary>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Update(Guid id, [FromForm] UpdateStudentRequest request)
        {
            var educationLevel = EducationLevel.FromName<EducationLevel>(request.EducationLevel);
            if (educationLevel == null)
            {
                return BadRequest($"Invalid education level: {request.EducationLevel}");
            }

            var command = new UpdateStudentCommand(
                id,
                request.FirstName,
                request.LastName,
                request.Bio,
                request.University,
                request.Faculty,
                request.Specialization,
                request.StudyYear,
                educationLevel,
                request.LinkedInUrl,
                request.GitHubUrl,
                request.FacebookUrl,
                request.Avatar);

            var result = await _mediator.Send(command);

            return result.Match(
                _ => NoContent(),
                HandleFailure);
        }

        /// <summary>
        /// Delete a student
        /// </summary>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _mediator.Send(new DeleteStudentCommand(id));

            return result.Match(
                _ => NoContent(),
                HandleFailure);
        }

        /// <summary>
        /// Update student interests
        /// </summary>
        [HttpPut("{id}/interests")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateInterests(Guid id, UpdateStudentInterestsRequest request)
        {
            var command = new UpdateStudentInterestsCommand(id, request.Interests);
            var result = await _mediator.Send(command);

            return result.Match(
                _ => NoContent(),
                HandleFailure);
        }
    }
} 