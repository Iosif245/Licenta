namespace ConnectCampus.Domain.Common.Results;

public record ValidationDetail(string PropertyName, string ErrorMessage, string ErrorCode);

public sealed record Error(string Code, string Message, ErrorType Type)
{
    public IReadOnlyList<ValidationDetail> ValidationDetails { get; init; } = Array.Empty<ValidationDetail>();
    
    public static readonly Error None = new(string.Empty, string.Empty, ErrorType.None);

    public static Error Validation(string code, string message) =>
        new(code, message, ErrorType.Validation);

    public static Error NotFound(string code, string message) =>
        new(code, message, ErrorType.NotFound);

    public static Error Conflict(string code, string message) =>
        new(code, message, ErrorType.Conflict);

    public static Error Unauthorized(string code, string message) =>
        new(code, message, ErrorType.Unauthorized);

    public static Error Forbidden() =>
        new("Forbidden", "", ErrorType.Forbidden);

    public static Error ServerError(string code, string message) =>
        new(code, message, ErrorType.ServerError);

    public static Error ServiceUnavailable(string code, string message) =>
        new(code, message, ErrorType.ServiceUnavailable);
}

public enum ErrorType
{
    None,
    Validation,
    NotFound,
    Conflict,
    Unauthorized,
    Forbidden,
    ServerError,
    ServiceUnavailable
} 