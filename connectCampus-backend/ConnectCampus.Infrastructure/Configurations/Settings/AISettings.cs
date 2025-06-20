namespace ConnectCampus.Infrastructure.Configuration.Settings;

public class AISettings
{
    public const string SectionName = "AI";
    
    public string GeminiApiKey { get; set; } = string.Empty;
    public string GeminiModel { get; set; } = "gemini-2.0-flash-exp";
    public string GeminiBaseUrl { get; set; } = "https://generativelanguage.googleapis.com/v1beta";
    public double Temperature { get; set; } = 0.7;
    public int MaxTokens { get; set; } = 1024;
} 