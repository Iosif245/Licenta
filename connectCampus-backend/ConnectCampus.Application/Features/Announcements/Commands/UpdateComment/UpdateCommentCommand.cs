using System;
using ConnectCampus.Application.Abstractions.Messaging;

namespace ConnectCampus.Application.Features.Announcements.Commands.UpdateComment
{
    public record UpdateCommentCommand(
        Guid CommentId,
        string Content
    ) : ICommand<bool>;
} 
 
 