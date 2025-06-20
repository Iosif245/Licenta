using System.Text;
using System.Text.Json;
using ConnectCampus.Application.Abstractions.Services;
using ConnectCampus.Application.Common;
using ConnectCampus.Domain.Common.Results;
using ConnectCampus.Infrastructure.Configuration.Settings;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Text.Json.Serialization;

namespace ConnectCampus.Infrastructure.Services;

public class AIContentService : IAIContentService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly AISettings _aiSettings;
    private readonly ILogger<AIContentService> _logger;

    public AIContentService(
        IHttpClientFactory httpClientFactory,
        IOptions<AISettings> aiSettings,
        ILogger<AIContentService> logger)
    {
        _httpClientFactory = httpClientFactory;
        _aiSettings = aiSettings.Value;
        _logger = logger;
    }

    public async Task<Result<AIContentImprovementResult>> ImproveContentAsync(
        string content, 
        string contentType, 
        CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Starting content improvement for type: {ContentType}, length: {ContentLength}", 
                contentType, content?.Length ?? 0);

            if (string.IsNullOrWhiteSpace(content) || content.Length < 10)
            {
                _logger.LogWarning("Content validation failed - too short: {ContentLength}", content?.Length ?? 0);
                return Result.Failure<AIContentImprovementResult>(
                    Error.Validation("Content.TooShort", "Content must be at least 10 characters long."));
            }

            // Validate AI settings
            if (string.IsNullOrWhiteSpace(_aiSettings.GeminiApiKey))
            {
                _logger.LogError("Gemini API key is not configured");
                return Result.Failure<AIContentImprovementResult>(
                    Error.ServerError("AI.ConfigurationError", "AI service is not properly configured."));
            }

            var httpClient = _httpClientFactory.CreateClient();
            
            // Construct the Gemini API URL
            var geminiUrl = $"{_aiSettings.GeminiBaseUrl}/models/{_aiSettings.GeminiModel}:generateContent?key={_aiSettings.GeminiApiKey}";
            _logger.LogInformation("Calling Gemini API at: {GeminiUrl}", geminiUrl.Replace(_aiSettings.GeminiApiKey, "***"));

            // Create the prompt based on content type
            var prompt = CreateImprovementPrompt(content, contentType);
            _logger.LogDebug("Generated prompt for content improvement");

            var geminiRequest = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = prompt }
                        }
                    }
                },
                generationConfig = new
                {
                    temperature = _aiSettings.Temperature,
                    topK = 40,
                    topP = 0.95,
                    maxOutputTokens = _aiSettings.MaxTokens,
                    responseMimeType = "application/json"
                },
                safetySettings = new[]
                {
                    new
                    {
                        category = "HARM_CATEGORY_HARASSMENT",
                        threshold = "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    new
                    {
                        category = "HARM_CATEGORY_HATE_SPEECH", 
                        threshold = "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    new
                    {
                        category = "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        threshold = "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    new
                    {
                        category = "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold = "BLOCK_MEDIUM_AND_ABOVE"
                    }
                }
            };

            string jsonContent;
            try
            {
                jsonContent = JsonSerializer.Serialize(geminiRequest);
                _logger.LogDebug("Serialized request to JSON successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to serialize request to JSON");
                return Result.Failure<AIContentImprovementResult>(
                    Error.ServerError("AI.SerializationError", "Failed to prepare request for AI service."));
            }

            var requestContent = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            _logger.LogInformation("Sending request to Gemini API for content improvement");

            HttpResponseMessage response;
            string responseContent;
            
            try
            {
                // Log the request payload (without sensitive data)
                _logger.LogDebug("Request payload: {RequestPayload}", jsonContent);
                
                response = await httpClient.PostAsync(geminiUrl, requestContent, cancellationToken);
                responseContent = await response.Content.ReadAsStringAsync(cancellationToken);
                _logger.LogInformation("Received response from Gemini API - Status: {StatusCode}, ContentLength: {ContentLength}", 
                    response.StatusCode, responseContent?.Length ?? 0);
                
                // Log the actual response for debugging (truncated if too long)
                var logContent = responseContent?.Length > 500 ? responseContent[..500] + "..." : responseContent;
                _logger.LogDebug("Gemini API response content: {ResponseContent}", logContent);
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HTTP request to Gemini API failed");
                return Result.Failure<AIContentImprovementResult>(
                    Error.ServiceUnavailable("AI.NetworkError", "Unable to connect to AI service. Please try again later."));
            }
            catch (TaskCanceledException ex)
            {
                _logger.LogError(ex, "Request to Gemini API timed out");
                return Result.Failure<AIContentImprovementResult>(
                    Error.ServiceUnavailable("AI.TimeoutError", "AI service request timed out. Please try again."));
            }

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Gemini API error: {StatusCode} - {Content}", response.StatusCode, responseContent);
                return Result.Failure<AIContentImprovementResult>(
                    Error.ServiceUnavailable("AI.ServiceUnavailable", "AI service temporarily unavailable. Please try again later."));
            }

            // Deserialize the response
            var geminiResponse = JsonSerializer.Deserialize<GeminiResponse>(responseContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
            
            _logger.LogDebug("Successfully deserialized Gemini API response");
            _logger.LogDebug("Response has {CandidatesCount} candidates", geminiResponse?.Candidates?.Length ?? 0);

            if (geminiResponse?.Candidates?.Length > 0 && 
                geminiResponse.Candidates[0].Content?.Parts?.Length > 0)
            {
                var aiResponseText = geminiResponse.Candidates[0].Content.Parts[0].Text;
                _logger.LogDebug("Extracted AI response text, length: {TextLength}", aiResponseText?.Length ?? 0);
                
                try
                {
                    // The AI response text contains the JSON we need to parse
                    var aiResult = JsonSerializer.Deserialize<AIContentImprovementResult>(aiResponseText, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                    
                    if (!string.IsNullOrWhiteSpace(aiResult?.ImprovedContent))
                    {
                        _logger.LogInformation("Successfully improved content using AI");
                        return Result.Success(new AIContentImprovementResult
                        {
                            ImprovedContent = aiResult.ImprovedContent,
                            Suggestions = aiResult.Suggestions ?? new List<ImprovementSuggestion>
                            {
                                new() { Type = "clarity", Description = "Enhanced clarity and readability" },
                                new() { Type = "engagement", Description = "Improved engagement and tone" }
                            }
                        });
                    }
                    else
                    {
                        _logger.LogWarning("AI result parsed but ImprovedContent is empty");
                    }
                }
                catch (JsonException ex)
                {
                    _logger.LogWarning(ex, "Failed to parse AI response as JSON, treating as plain text: {ResponseText}", aiResponseText);
                    
                    // If JSON parsing fails, treat the response as plain text
                    if (!string.IsNullOrWhiteSpace(aiResponseText))
                    {
                        _logger.LogInformation("Using AI response as plain text improvement");
                        return Result.Success(new AIContentImprovementResult
                        {
                            ImprovedContent = aiResponseText.Trim(),
                            Suggestions = new List<ImprovementSuggestion>
                            {
                                new() { Type = "clarity", Description = "Enhanced clarity and readability" },
                                new() { Type = "engagement", Description = "Improved engagement and tone" }
                            }
                        });
                    }
                }
            }
            else
            {
                _logger.LogWarning("Gemini API response does not contain valid candidates or content");
                
                // Log the actual response structure for debugging
                _logger.LogDebug("Response structure - Candidates count: {CandidatesCount}, Response: {ResponseContent}", 
                    geminiResponse?.Candidates?.Length ?? 0, responseContent);
                
                // Check if there's an error in the response
                if (responseContent.Contains("\"error\""))
                {
                    _logger.LogError("Gemini API returned an error response: {ResponseContent}", responseContent);
                    return Result.Failure<AIContentImprovementResult>(
                        Error.ServiceUnavailable("AI.ApiError", "AI service returned an error. Please try again later."));
                }
            }

            // If we get here, the AI didn't provide any usable response
            _logger.LogWarning("AI service did not provide a valid response for content improvement");
            return Result.Failure<AIContentImprovementResult>(
                Error.ServerError("AI.NoResponse", "AI service did not provide a valid response. Please try again."));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error improving content with AI - Content: {Content}, Type: {ContentType}", 
                content?.Substring(0, Math.Min(100, content?.Length ?? 0)), contentType);
            return Result.Failure<AIContentImprovementResult>(
                Error.ServerError("AI.ProcessingError", "An error occurred while improving content. Please try again."));
        }
    }

    private string CreateImprovementPrompt(string content, string contentType)
    {
        var contextDescription = contentType switch
        {
            "event" => "event description for a campus event",
            "announcement" => "announcement for a campus association",
            _ => "content for a campus platform"
        };

        return $@"You are a professional content writer for a university campus platform. Your task is to improve the following {contextDescription} with a formal but friendly tone.

CRITICAL REQUIREMENTS:
- PRESERVE THE ORIGINAL LANGUAGE: If the content is in Romanian, respond in Romanian. If in English, respond in English.
- DEVELOP THE CONTENT: Expand and enrich the content with relevant details while keeping it engaging
- USE FORMAL BUT FRIENDLY TONE: Professional yet approachable language, avoid heavy academic jargon
- MAINTAIN CLARITY: Use clear, well-structured sentences that are easy to understand
- ENHANCE ENGAGEMENT: Make the content more interesting and appealing to students

IMPROVEMENT GUIDELINES:
- Expand the content with relevant details and context
- Use clear, well-structured paragraphs
- Add warmth and friendliness while maintaining professionalism
- Improve readability and flow with smooth transitions
- Make the content more comprehensive and informative
- Include helpful details that enhance understanding
- Use active voice and engaging language
- Structure the content logically with good organization
- Preserve all important information and expand where beneficial

Original content: ""{content}""

CRITICAL: You MUST respond with ONLY a valid JSON object in this exact format (no other text before or after):
{{
  ""improvedContent"": ""[your improved, well-developed version - comprehensive yet friendly and professional]"",
  ""suggestions"": [
    {{""type"": ""tone"", ""description"": ""Enhanced with formal but friendly tone""}},
    {{""type"": ""development"", ""description"": ""Expanded content with relevant details""}},
    {{""type"": ""engagement"", ""description"": ""Made more engaging for students""}},
    {{""type"": ""structure"", ""description"": ""Improved organization and flow""}}
  ]
}}";
    }
}

// Gemini API response models
public class GeminiResponse
{
    [JsonPropertyName("candidates")]
    public GeminiCandidate[]? Candidates { get; set; }
}

public class GeminiCandidate
{
    [JsonPropertyName("content")]
    public GeminiContent? Content { get; set; }
}

public class GeminiContent
{
    [JsonPropertyName("parts")]
    public GeminiPart[]? Parts { get; set; }
}

public class GeminiPart
{
    [JsonPropertyName("text")]
    public string Text { get; set; } = string.Empty;
} 