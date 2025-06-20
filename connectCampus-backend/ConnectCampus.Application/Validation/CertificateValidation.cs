using FluentValidation;
using Microsoft.AspNetCore.Http;

namespace ConnectCampus.Application.Validation;

public static class CertificateValidation
{
    private static readonly HashSet<string> AllowedContentTypes = new() { "image/png", "image/jpeg", "application/pdf" };
    private const long MaxSizeInBytes = 5 * 1024 * 1024; // 5MB

    public static IRuleBuilderOptions<T, IFormFile> ValidCertificateContentType<T>(this IRuleBuilder<T, IFormFile> ruleBuilder)
    {
        return ruleBuilder.Must(file => AllowedContentTypes.Contains(file.ContentType))
            .WithMessage("Invalid file type. Only PNG and JPEG are allowed.");
    }

    public static IRuleBuilderOptions<T, IFormFile> ValidCertificateFileSize<T>(this IRuleBuilder<T, IFormFile> ruleBuilder)
    {
        return ruleBuilder.Must(file => file.Length <= MaxSizeInBytes)
            .WithMessage("File size exceeds the 5MB limit.");
    }
}