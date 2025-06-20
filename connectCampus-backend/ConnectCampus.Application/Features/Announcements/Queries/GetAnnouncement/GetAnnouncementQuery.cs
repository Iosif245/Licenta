using System;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Features.Announcements.Dtos;

namespace ConnectCampus.Application.Features.Announcements.Queries.GetAnnouncement
{
    public record GetAnnouncementQuery(Guid Id) : IQuery<AnnouncementDto>;
} 