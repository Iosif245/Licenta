using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Common;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Common;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Associations.Commands.UpdateAssociation
{
    public class UpdateAssociationCommandHandler : ICommandHandler<UpdateAssociationCommand, bool>
    {
        private readonly IAssociationRepository _associationRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IS3Handler _storageService;

        public UpdateAssociationCommandHandler(
            IAssociationRepository associationRepository,
            IUnitOfWork unitOfWork,
            IS3Handler storageService)
        {
            _associationRepository = associationRepository;
            _unitOfWork = unitOfWork;
            _storageService = storageService;
        }

        public async Task<Result<bool>> Handle(UpdateAssociationCommand request, CancellationToken cancellationToken)
        {
            var association = await _associationRepository.GetByIdAsync(request.Id, cancellationToken);
            
            if (association == null)
            {
                return Result.Failure<bool>(ValidationErrors.Association.NotFound);
            }

            // Handle logo upload if provided
            if (request.Logo != null)
            {
                var logoPath = StoragePaths.Avatar(association.Logo);
                var logoUploadResult = await _storageService.UploadAsync(logoPath, request.Logo, cancellationToken);
                
                if (!logoUploadResult.IsSuccess)
                {
                    return Result.Failure<bool>(logoUploadResult.Error);
                }
                
                association.UpdateImages(logoPath, association.CoverImage);
            }

            // Handle cover image upload if provided
            if (request.CoverImage != null)
            {
                var coverPath = StoragePaths.Cover(association.CoverImage);
                var coverUploadResult = await _storageService.UploadAsync(coverPath, request.CoverImage, cancellationToken);
                
                if (!coverUploadResult.IsSuccess)
                {
                    return Result.Failure<bool>(coverUploadResult.Error);
                }
                
                association.UpdateImages(association.Logo, coverPath);
            }

            // Update basic info
            association.UpdateBasicInfo(
                request.Name,
                request.Slug,
                request.Description,
                request.Category,
                request.FoundedYear,
                request.Email);
            
            // Update contact info
            association.UpdateContactInfo(
                request.Location,
                request.Website,
                request.Phone,
                request.Address,
                request.Facebook,
                request.Twitter,
                request.Instagram,
                request.LinkedIn);
            
            // Update tags if provided
            if (request.Tags != null)
            {
                association.UpdateTags(request.Tags);
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            
            return Result.Success(true);
        }
    }
} 