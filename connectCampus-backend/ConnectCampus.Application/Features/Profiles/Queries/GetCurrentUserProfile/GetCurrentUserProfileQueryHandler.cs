using System;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Domain.Common;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Profiles.Queries.GetCurrentUserProfile
{
    public class GetCurrentUserProfileQueryHandler : IQueryHandler<GetCurrentUserProfileQuery, CurrentUserProfileResponse>
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly IUserRepository _userRepository;
        private readonly IStudentRepository _studentRepository;
        private readonly IAssociationRepository _associationRepository;

        public GetCurrentUserProfileQueryHandler(
            ICurrentUserService currentUserService,
            IUserRepository userRepository,
            IStudentRepository studentRepository,
            IAssociationRepository associationRepository)
        {
            _currentUserService = currentUserService;
            _userRepository = userRepository;
            _studentRepository = studentRepository;
            _associationRepository = associationRepository;
        }

        public async Task<Maybe<CurrentUserProfileResponse>> Handle(GetCurrentUserProfileQuery request, CancellationToken cancellationToken)
        {
            if (!_currentUserService.IsAuthenticated)
            {
                return Maybe<CurrentUserProfileResponse>.None;
            }

            var currentUserId = _currentUserService.UserId;
            if (!currentUserId.HasValue)
            {
                return Maybe<CurrentUserProfileResponse>.None;
            }

            var user = await _userRepository.GetByIdAsync(currentUserId.Value, cancellationToken);
            if (user is null)
            {
                return Maybe<CurrentUserProfileResponse>.None;
            }

            var response = new CurrentUserProfileResponse
            {
                UserId = user.Id,
                Email = user.Email,
                Role = user.Role.Name // Convert role to string
            };

            // Load additional profile data based on role
            if (user.Role.Name == "Student")
            {
                var student = await _studentRepository.GetByUserIdAsync(user.Id, cancellationToken);
                if (student is not null)
                {
                    response.StudentProfile = new StudentProfileData
                    {
                        Id = student.Id,
                        FirstName = student.FirstName,
                        LastName = student.LastName,
                        Bio = student.Bio,
                        AvatarUrl = student.AvatarUrl,
                        University = student.University,
                        Faculty = student.Faculty,
                        Specialization = student.Specialization,
                        StudyYear = student.StudyYear,
                        EducationLevel = student.EducationLevel.Name,
                        LinkedInUrl = student.LinkedInUrl,
                        GitHubUrl = student.GitHubUrl,
                        FacebookUrl = student.FacebookUrl,
                        Interests = student.Interests,
                        CreatedAt = student.CreatedAt,
                        UpdatedAt = student.UpdatedAt
                    };
                }
            }
            else if (user.Role.Name == "Association")
            {
                var association = await _associationRepository.GetByUserIdAsync(user.Id, cancellationToken);
                if (association is not null)
                {
                    response.AssociationProfile = new AssociationProfileData
                    {
                        Id = association.Id,
                        Name = association.Name,
                        Slug = association.Slug,
                        Description = association.Description,
                        Logo = association.Logo,
                        CoverImage = association.CoverImage,
                        Category = association.Category,
                        FoundedYear = association.FoundedYear,
                        IsVerified = association.IsVerified,
                        IsFeatured = false, // Simplified entity - no longer has this field
                        Events = association.Events,
                        UpcomingEventsCount = association.UpcomingEventsCount,
                        Followers = association.Followers,
                        Location = association.Location,
                        Website = association.Website,
                        Tags = association.Tags,
                        Phone = association.Phone,
                        Address = association.Address,
                        Facebook = association.Facebook,
                        Twitter = association.Twitter,
                        Instagram = association.Instagram,
                        LinkedIn = association.LinkedIn,
                        CreatedAt = association.CreatedAt,
                        UpdatedAt = association.UpdatedAt
                    };
                }
            }

            return response;
        }
    }
} 