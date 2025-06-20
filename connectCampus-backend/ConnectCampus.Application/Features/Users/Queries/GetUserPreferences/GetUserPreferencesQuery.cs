using System;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Features.Users.Dtos;

namespace ConnectCampus.Application.Features.Users.Queries.GetUserPreferences
{
    public record GetUserPreferencesQuery(Guid UserId) : IQuery<UserPreferencesDto>;
} 