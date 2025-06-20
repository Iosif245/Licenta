using System;
using System.Collections.Generic;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Features.Announcements.Dtos;

namespace ConnectCampus.Application.Features.Announcements.Queries.GetAnnouncementComments
{
    public record GetAnnouncementCommentsQuery(Guid AnnouncementId) : IQuery<List<AnnouncementCommentDto>>;
} 
 
 