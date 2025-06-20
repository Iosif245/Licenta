/*using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Common;
using ConnectCampus.Domain.Common.Results;
using ConnectCampus.Domain.Common.Time;
using ConnectCampus.Domain.Entities;

namespace ConnectCampus.Application.Features.Certificates.UploadCertificate;

public class UploadCertificateCommandHandler : ICommandHandler<UploadCertificateCommand, Guid>
{
    private readonly IUserRepository _userRepository;
    private readonly ICertificateRepository _certificateRepository;
    private readonly IS3Handler _s3Handler;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IDateTimeMachine _dateTime;
    private readonly ICurrentUserService _currentUserService;

    public UploadCertificateCommandHandler(
        IUserRepository userRepository,
        ICertificateRepository certificateRepository,
        IS3Handler s3Handler,
        IUnitOfWork unitOfWork,
        IDateTimeMachine dateTime, 
        ICurrentUserService currentUserService)
    {
        _userRepository = userRepository;
        _certificateRepository = certificateRepository;
        _s3Handler = s3Handler;
        _unitOfWork = unitOfWork;
        _dateTime = dateTime;
        _currentUserService = currentUserService;
    }

    public async Task<Result<Guid>> Handle(UploadCertificateCommand request, CancellationToken cancellationToken)
    {
        if (_currentUserService.UserId != request.UserId)
        {
            return Result.Failure<Guid>(ValidationErrors.User.IdNotMatched);
        }
        if (!_currentUserService.IsInRole(UserRole.Association))
        {
            return Result.Failure<Guid>(ValidationErrors.User.ProfessionistRoleRequired);
        }
        
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
        if (user == null)
        {
            return Result.Failure<Guid>(ValidationErrors.User.NotFound);
        }

        var key = StoragePaths.Certificate();
        
        var uploadResult = await _s3Handler.UploadAsync(key, request.Document, cancellationToken);
        if (!uploadResult.IsSuccess)
        {
            return Result.Failure<Guid>(uploadResult.Error);
        }

        var certificate = new Certificate(
            user.Id,
            request.Name,
            key,
            _dateTime.UtcNow);

        var addResult = user.AddCertificate(certificate, _dateTime.UtcNow);
        if (!addResult.IsSuccess)
        {
            return Result.Failure<Guid>(addResult.Error);
        }

        _certificateRepository.Add(certificate);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return certificate.Id;
    }
} */