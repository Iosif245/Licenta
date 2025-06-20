using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Common;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Common.Results;

namespace ConnectCampus.Application.Features.Associations.Commands.DeleteAssociation
{
    public class DeleteAssociationCommandHandler : ICommandHandler<DeleteAssociationCommand, bool>
    {
        private readonly IAssociationRepository _associationRepository;
        private readonly IUnitOfWork _unitOfWork;

        public DeleteAssociationCommandHandler(
            IAssociationRepository associationRepository,
            IUnitOfWork unitOfWork)
        {
            _associationRepository = associationRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<bool>> Handle(DeleteAssociationCommand request, CancellationToken cancellationToken)
        {
            var association = await _associationRepository.GetByIdAsync(request.Id, cancellationToken);
            
            if (association == null)
            {
                return Result.Failure<bool>(ValidationErrors.Association.NotFound);
            }

            _associationRepository.Remove(association);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            
            return Result.Success(true);
        }
    }
} 