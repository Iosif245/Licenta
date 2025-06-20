using ConnectCampus.Application.Common;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Abstractions.Services;

public interface IAIContentService
{
    Task<Result<AIContentImprovementResult>> ImproveContentAsync(
        string content, 
        string contentType, 
        CancellationToken cancellationToken = default);
}

public class AIContentImprovementResult
{
    public string ImprovedContent { get; set; } = string.Empty;
    public List<ImprovementSuggestion> Suggestions { get; set; } = new();
}

public class ImprovementSuggestion
{
    public string Type { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
} 