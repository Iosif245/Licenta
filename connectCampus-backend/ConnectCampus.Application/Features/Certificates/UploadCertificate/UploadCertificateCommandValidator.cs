using FluentValidation;
using ConnectCampus.Application.Common.Behaviors;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Common;
using ConnectCampus.Domain.Entities;

namespace ConnectCampus.Application.Features.Certificates.UploadCertificate;

public class UploadCertificateCommandValidator : AbstractValidator<UploadCertificateCommand>
{
    public UploadCertificateCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithError(ValidationErrors.User.IdentifierRequired);
        
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithError(ValidationErrors.Certificate.NameRequired)
            .MaximumLength(Certificate.MaxNameLength)
            .WithError(ValidationErrors.Certificate.NameMaxLength);
        
        RuleFor(x => x.Document)
            .NotNull().WithError(ValidationErrors.Certificate.DocumentRequired)
            .ValidCertificateContentType().WithError(ValidationErrors.Certificate.DocumentTypeInvalid)
            .ValidCertificateFileSize().WithError(ValidationErrors.Certificate.DocumentSizeLimit);
    }
} 