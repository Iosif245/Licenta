using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Users.Queries.GetCurrentUser
{
    public class GetCurrentUserQueryHandler : IQueryHandler<GetCurrentUserQuery, CurrentUserResponse>
    {
        private readonly IUserRepository _userRepository;
        private readonly ICurrentUserService _currentUserService;

        public GetCurrentUserQueryHandler(
            IUserRepository userRepository,
            ICurrentUserService currentUserService)
        {
            _userRepository = userRepository;
            _currentUserService = currentUserService;
        }

        public async Task<Maybe<CurrentUserResponse>> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
        {
            if (!_currentUserService.IsAuthenticated)
            {
                return Maybe<CurrentUserResponse>.None;
            }

            var userId = _currentUserService.UserId ?? Guid.Empty;
            var user = await _userRepository.GetByIdAsync(userId, cancellationToken);

            if (user == null)
            {
                return Maybe<CurrentUserResponse>.None;
            }

            var response = new CurrentUserResponse(
                user.Id,
                user.Email,
                user.Role.Name);

            return response;
        }
    }
} 