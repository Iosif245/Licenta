namespace ConnectCampus.Application.Features.Certificates;

public record CertificateDto(
    Guid Id,
    string Name,
    string Status,
    DateTime CreatedAt); 