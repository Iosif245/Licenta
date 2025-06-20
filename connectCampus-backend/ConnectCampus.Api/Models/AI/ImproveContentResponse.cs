namespace ConnectCampus.Api.Models.AI;

public class ImproveContentResponse
{
    /// <summary>
    /// The improved version of the content
    /// </summary>
    public string ImprovedContent { get; set; } = string.Empty;
    
    /// <summary>
    /// List of improvements made to the content
    /// </summary>
    public List<ImprovementSuggestionResponse> Suggestions { get; set; } = new();
}

public class ImprovementSuggestionResponse
{
    /// <summary>
    /// The type of improvement (e.g., clarity, engagement, grammar)
    /// </summary>
    public string Type { get; set; } = string.Empty;
    
    /// <summary>
    /// Description of the improvement made
    /// </summary>
    public string Description { get; set; } = string.Empty;
} 