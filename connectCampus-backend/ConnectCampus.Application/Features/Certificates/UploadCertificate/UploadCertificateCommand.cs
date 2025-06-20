using ConnectCampus.Application.Abstractions.Messaging;
using Microsoft.AspNetCore.Http;

namespace ConnectCampus.Application.Features.Certificates.UploadCertificate;

public record UploadCertificateCommand(
    Guid UserId,
    string Name,
    IFormFile Document) : ICommand<Guid>; 