using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Features.Users.Dtos;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Users.Queries.GetUserPreferences
{
    public class GetUserPreferencesQueryHandler : IQueryHandler<GetUserPreferencesQuery, UserPreferencesDto>
    {
        private readonly IUserRepository _userRepository;

        public GetUserPreferencesQueryHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<Maybe<UserPreferencesDto>> Handle(GetUserPreferencesQuery request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);

            if (user == null)
            {
                return Maybe<UserPreferencesDto>.None;
            }

            var preferences = new UserPreferencesDto(
                IsTwoFactorEnabled: user.IsTwoFactorEnabled,
                EventRemindersEnabled: user.EventRemindersEnabled,
                MessageNotificationsEnabled: user.MessageNotificationsEnabled,
                AssociationUpdatesEnabled: user.AssociationUpdatesEnabled,
                MarketingEmailsEnabled: user.MarketingEmailsEnabled,
                Theme: user.PreferredTheme.Name);

            return preferences;
        }
    }
} 