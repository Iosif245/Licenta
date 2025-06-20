namespace ConnectCampus.Api.Models.AI;

public class ImproveContentRequest
{
    /// <summary>
    /// The content to be improved
    /// </summary>
    public string Content { get; set; } = string.Empty;
    
    /// <summary>
    /// The type of content (announcement or event)
    /// </summary>
    public string Type { get; set; } = "announcement";
} 