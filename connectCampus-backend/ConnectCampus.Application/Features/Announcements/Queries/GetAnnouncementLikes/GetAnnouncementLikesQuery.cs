using System;
using System.Collections.Generic;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Features.Announcements.Dtos;

namespace ConnectCampus.Application.Features.Announcements.Queries.GetAnnouncementLikes
{
    public record GetAnnouncementLikesQuery(Guid AnnouncementId) : IQuery<List<AnnouncementLikeDto>>;
} 
 
 