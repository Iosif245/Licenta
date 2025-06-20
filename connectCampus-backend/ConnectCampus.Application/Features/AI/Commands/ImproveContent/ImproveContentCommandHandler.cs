using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Services;
using ConnectCampus.Application.Common;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.AI.Commands.ImproveContent;

public class ImproveContentCommandHandler : ICommandHandler<ImproveContentCommand, AIContentImprovementResult>
{
    private readonly IAIContentService _aiContentService;

    public ImproveContentCommandHandler(IAIContentService aiContentService)
    {
        _aiContentService = aiContentService;
    }

    public async Task<Result<AIContentImprovementResult>> Handle(
        ImproveContentCommand request, 
        CancellationToken cancellationToken)
    {
        return await _aiContentService.ImproveContentAsync(
            request.Content, 
            request.Type, 
            cancellationToken);
    }
} 