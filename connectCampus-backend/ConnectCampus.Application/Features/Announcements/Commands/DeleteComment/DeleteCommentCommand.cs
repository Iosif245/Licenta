using System;
using ConnectCampus.Application.Abstractions.Messaging;

namespace ConnectCampus.Application.Features.Announcements.Commands.DeleteComment
{
    public record DeleteCommentCommand(Guid CommentId) : ICommand<bool>;
} 
 
 