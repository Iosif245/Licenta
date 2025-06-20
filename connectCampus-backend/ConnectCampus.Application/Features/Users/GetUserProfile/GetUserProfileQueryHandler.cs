/*using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Application.Features.Certificates;
using ConnectCampus.Domain.Common;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Users.GetUserProfile;

public class GetUserProfileQueryHandler : IQueryHandler<GetUserProfileQuery, UserProfileDto>
{
    private readonly IUserRepository _userRepository;
    private readonly ICertificateRepository _certificateRepository;
    private readonly ICurrentUserService _currentUserService;

    public GetUserProfileQueryHandler(
        IUserRepository userRepository,
        ICertificateRepository certificateRepository,
        ICurrentUserService currentUserService)
    {
        _userRepository = userRepository;
        _certificateRepository = certificateRepository;
        _currentUserService = currentUserService;
    }

    public async Task<Maybe<UserProfileDto>> Handle(GetUserProfileQuery request, CancellationToken cancellationToken)
    {
        if (!_currentUserService.IsAuthenticated)
        {
            return Maybe<UserProfileDto>.None;
        }

        //var user = await _userRepository.GetByIdWithCategoriesAsync(request.UserId, cancellationToken);
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);  //pusa de mine
        if (user == null)
        {
            return Maybe<UserProfileDto>.None;
        }

        List<CertificateDto>? certificates = null;
        if (user.Role.Value == UserRole.Association.Value)
        {
            var userCertificates = await _certificateRepository.GetByUserIdAsync(user.Id, cancellationToken);
            certificates = userCertificates.Select(c => new CertificateDto(
                c.Id,
                c.Name,
                c.Status.ToString(),
                c.CreatedAt
            )).ToList();
        }

        return new UserProfileDto(
            user.Id,
            user.Email,
            user.FirstName,
            user.LastName,
            user.Role.Name,
            StoragePaths.BuildUrl(user.AvatarImageUrl),
            user.Location,
            user.PhoneNumber,
            user.Bio,
            user.StripeCustomerId,
            certificates,
            user.CreatedAt,
            user.UpdatedAt);
    }
} */