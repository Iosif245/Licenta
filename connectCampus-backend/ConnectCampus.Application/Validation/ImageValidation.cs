using FluentValidation;
using Microsoft.AspNetCore.Http;

namespace ConnectCampus.Application.Validation;

public static class ImageValidation
{
    private static readonly HashSet<string> AllowedImageContentTypes = new() { "image/png", "image/jpeg", "image/jpg", "image/webp" };
    private const long MaxImageSizeInBytes = 10 * 1024 * 1024; // 10MB

    public static IRuleBuilderOptions<T, IFormFile> ValidImageContentType<T>(this IRuleBuilder<T, IFormFile> ruleBuilder)
    {
        return ruleBuilder.Must(file => AllowedImageContentTypes.Contains(file.ContentType.ToLowerInvariant()))
            .WithMessage("Invalid file type. Only PNG, JPEG, JPG, and WebP images are allowed.");
    }

    public static IRuleBuilderOptions<T, IFormFile> ValidImageFileSize<T>(this IRuleBuilder<T, IFormFile> ruleBuilder)
    {
        return ruleBuilder.Must(file => file.Length <= MaxImageSizeInBytes)
            .WithMessage("Image size exceeds the 10MB limit.");
    }

    public static IRuleBuilderOptions<T, IFormFile?> ValidOptionalImageContentType<T>(this IRuleBuilder<T, IFormFile?> ruleBuilder)
    {
        return ruleBuilder.Must(file => file == null || AllowedImageContentTypes.Contains(file.ContentType.ToLowerInvariant()))
            .WithMessage("Invalid file type. Only PNG, JPEG, JPG, and WebP images are allowed.");
    }

    public static IRuleBuilderOptions<T, IFormFile?> ValidOptionalImageFileSize<T>(this IRuleBuilder<T, IFormFile?> ruleBuilder)
    {
        return ruleBuilder.Must(file => file == null || file.Length <= MaxImageSizeInBytes)
            .WithMessage("Image size exceeds the 10MB limit.");
    }
} 