using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Domain.Common;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Events.Queries.CheckEventRegistrationStatus
{
    public class CheckEventRegistrationStatusQueryHandler : IQueryHandler<CheckEventRegistrationStatusQuery, bool>
    {
        private readonly IStudentEventRegistrationRepository _registrationRepository;

        public CheckEventRegistrationStatusQueryHandler(IStudentEventRegistrationRepository registrationRepository)
        {
            _registrationRepository = registrationRepository;
        }

        public async Task<Maybe<bool>> Handle(CheckEventRegistrationStatusQuery request, CancellationToken cancellationToken)
        {
            var isRegistered = await _registrationRepository.ExistsByStudentAndEventAsync(
                request.StudentId, 
                request.EventId, 
                cancellationToken);

            return isRegistered;
        }
    }
} 