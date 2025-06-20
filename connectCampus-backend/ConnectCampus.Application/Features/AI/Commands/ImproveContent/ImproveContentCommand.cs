using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Services;

namespace ConnectCampus.Application.Features.AI.Commands.ImproveContent;

public record ImproveContentCommand(
    string Content,
    string Type
) : ICommand<AIContentImprovementResult>; 