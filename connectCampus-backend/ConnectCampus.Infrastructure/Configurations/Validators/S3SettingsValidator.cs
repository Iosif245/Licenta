using ConnectCampus.Infrastructure.Configuration.Settings;
using FluentValidation;

namespace ConnectCampus.Infrastructure.Configuration.Validators;

public class S3SettingsValidator : AbstractValidator<S3Settings>
{
    public S3SettingsValidator()
    {
        RuleFor(x => x.BucketName).NotEmpty();
        RuleFor(x => x.BucketLink).NotEmpty();
    }
}
