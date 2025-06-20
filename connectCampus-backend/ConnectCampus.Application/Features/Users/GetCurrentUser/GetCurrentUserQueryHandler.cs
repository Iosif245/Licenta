/*using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Users.GetCurrentUser
{
    public class GetCurrentUserQueryHandler : IQueryHandler<GetCurrentUserQuery, CurrentUserResponse>
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly IUserRepository _userRepository;
        private readonly INotificationRepository _notificationRepository;

        public GetCurrentUserQueryHandler(
            ICurrentUserService currentUserService,
            IUserRepository userRepository,
            INotificationRepository notificationRepository)
        {
            _currentUserService = currentUserService;
            _userRepository = userRepository;
            _notificationRepository = notificationRepository;
        }

        public async Task<Maybe<CurrentUserResponse>> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
        {
            if (!_currentUserService.IsAuthenticated)
            {
                return Maybe<CurrentUserResponse>.None;
            }

            var user = await _userRepository.GetByIdAsync(_currentUserService.UserId!.Value, cancellationToken);

            if (user == null)
            {
                return Maybe<CurrentUserResponse>.None;
            }

            var unreadNotificationsCount = await _notificationRepository.GetUnreadByUserIdAsync(user.Id, cancellationToken);

            var response = new CurrentUserResponse(
                user.Id,
                user.Email,
                user.FirstName,
                user.LastName,
                user.Role.Name,
                unreadNotificationsCount.Count);

            return response;
        }
    }
}*/