using System;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Features.Announcements.Dtos;

namespace ConnectCampus.Application.Features.Announcements.Queries.GetAnnouncementStatistics
{
    public record GetAnnouncementStatisticsQuery(Guid AnnouncementId) : IQuery<AnnouncementStatisticsDto>;
} 
 
 