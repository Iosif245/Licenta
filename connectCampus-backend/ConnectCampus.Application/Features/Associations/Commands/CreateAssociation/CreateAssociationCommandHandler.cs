using System;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Common;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Common.Results;
using ConnectCampus.Domain.Entities;

namespace ConnectCampus.Application.Features.Associations.Commands.CreateAssociation
{
    public class CreateAssociationCommandHandler : ICommandHandler<CreateAssociationCommand, Guid>
    {
        private readonly IAssociationRepository _associationRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CreateAssociationCommandHandler(
            IAssociationRepository associationRepository,
            IUnitOfWork unitOfWork)
        {
            _associationRepository = associationRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<Guid>> Handle(CreateAssociationCommand request, CancellationToken cancellationToken)
        {
            // Check for existing association by name or slug
            if (await _associationRepository.ExistsByNameAsync(request.Name, cancellationToken))
            {
                return Result.Failure<Guid>(ValidationErrors.Association.AlreadyExists);
            }

            if (await _associationRepository.ExistsBySlugAsync(request.Slug, cancellationToken))
            {
                return Result.Failure<Guid>(ValidationErrors.Association.SlugAlreadyExists);
            }

            // Create the association
            var association = new Association(
                request.UserId,
                request.Name,
                request.Slug,
                request.Description,
                request.Logo,
                request.CoverImage,
                request.Category,
                request.FoundedYear,
                request.Email);

            // Set optional properties
            if (request.Location != null)
            {
                association.UpdateContactInfo(
                    request.Location,
                    request.Website,
                    request.Phone,
                    request.Address,
                    request.Facebook,
                    request.Twitter,
                    request.Instagram,
                    request.LinkedIn);
            }

            if (request.Tags != null)
            {
                association.UpdateTags(request.Tags);
            }

            // Persist to database
            _associationRepository.Add(association);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success(association.Id);
        }
    }
} 