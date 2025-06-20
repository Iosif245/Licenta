using ConnectCampus.Application.Abstractions.Messaging;

namespace ConnectCampus.Application.Features.Profiles.Queries.GetCurrentUserProfile
{
    public record GetCurrentUserProfileQuery() : IQuery<CurrentUserProfileResponse>;
} 