using ConnectCampus.Domain.Common.Results;
using Microsoft.AspNetCore.Http;

namespace ConnectCampus.Application.Common.Interfaces;

public interface IS3Handler
{
    Task<Result> DeleteObjectAsync(string objectKey, CancellationToken cancellationToken = default);
    
    Task<Result> UploadAsync(string objectKey, IFormFile file, CancellationToken cancellationToken = default);
}