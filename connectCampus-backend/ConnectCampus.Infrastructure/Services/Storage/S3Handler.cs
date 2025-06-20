using Amazon.S3;
using Amazon.S3.Model;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Domain.Common;
using ConnectCampus.Domain.Common.Results;
using ConnectCampus.Infrastructure.Configuration.Settings;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using DeleteObjectRequest = Amazon.S3.Model.DeleteObjectRequest;
using PutObjectRequest = Amazon.S3.Model.PutObjectRequest;

namespace ConnectCampus.Infrastructure.Services.Storage;

public class S3Handler : IS3Handler
{
    private readonly IAmazonS3 _s3Client;
    private readonly IOptions<S3Settings> _settings;
    private readonly ILogger<S3Handler> _logger;

    public S3Handler(IAmazonS3 s3Client, ILogger<S3Handler> logger, IOptions<S3Settings> settings)
    {
        _s3Client = s3Client;
        _logger = logger;
        _settings = settings;
    }

    public async Task<Result> DeleteObjectAsync(string objectKey, CancellationToken cancellationToken = default)
    {   
        string prefix = "https://connect-campus.s3.eu-central-1.amazonaws.com";

        string cleanKey = objectKey.Replace(prefix, "");

        cleanKey = cleanKey.TrimStart('/');
        
        var deleteRequest = new DeleteObjectRequest()
        {
            BucketName = _settings.Value.BucketName,
            Key = cleanKey
        };

        try
        {
            await _s3Client.DeleteObjectAsync(deleteRequest, cancellationToken);
        }
        catch (AmazonS3Exception awsEx)
        {
            _logger.LogCritical("S3 service error when deleting object: {@Error}", awsEx);
            return Result.Failure(DomainErrors.ExternalServices.S3Unavailable($"Unable to delete file: {awsEx.Message}"));
        }
        catch (Exception ex)
        {
            _logger.LogCritical("Error when deleting S3 object: {@Error}", ex);
            return Result.Failure(Error.ServerError("Image.Deletion", "Failed to delete image"));
        }
        
        return Result.Success();
    }

    public async Task<Result> UploadAsync(string objectKey, IFormFile file, CancellationToken cancellationToken = default)
    {
        string prefix = "https://connect-campus.s3.eu-central-1.amazonaws.com";

        string cleanKey = objectKey.Replace(prefix, "");

        cleanKey = cleanKey.TrimStart('/');
        
        try
        {
            using var stream = file.OpenReadStream();
            
            stream.Position = 0;

            var putRequest = new PutObjectRequest()
            {
                BucketName = _settings.Value.BucketName,
                Key = cleanKey,
                InputStream = stream,
                ContentType = file.ContentType,
                AutoCloseStream = true,
                // Prevent browser caching for profile images
                Headers = 
                {
                    CacheControl = "no-cache, no-store, must-revalidate",
                    Expires = DateTime.UtcNow.AddDays(-1) // Set to past date
                },
                // Additional metadata to force no caching
                Metadata = 
                {
                    ["Pragma"] = "no-cache"
                }
            };

            await _s3Client.PutObjectAsync(putRequest, cancellationToken);
            return Result.Success();
        }
        catch (AmazonS3Exception awsEx)
        {
            _logger.LogCritical("S3 service error when uploading image: {@Error}", awsEx);
            return Result.Failure(DomainErrors.ExternalServices.S3Unavailable($"Unable to upload file: {awsEx.Message}"));
        }
        catch (Exception ex)
        {
            _logger.LogCritical("Error when uploading image to S3: {@Error}", ex);
            return Result.Failure(Error.ServerError("Image.Upload", "Failed to upload image"));
        }
    }
}
