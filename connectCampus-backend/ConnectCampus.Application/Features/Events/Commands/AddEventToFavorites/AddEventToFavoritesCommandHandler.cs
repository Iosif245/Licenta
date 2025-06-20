using System;
using System.Threading;
using System.Threading.Tasks;
using ConnectCampus.Application.Abstractions.Messaging;
using ConnectCampus.Application.Abstractions.Repositories;
using ConnectCampus.Application.Common;
using ConnectCampus.Application.Validation;
using ConnectCampus.Domain.Common.Results;
using ConnectCampus.Domain.Entities;

namespace ConnectCampus.Application.Features.Events.Commands.AddEventToFavorites
{
    public class AddEventToFavoritesCommandHandler : ICommandHandler<AddEventToFavoritesCommand, Guid>
    {
        private readonly IStudentFavoriteEventRepository _favoriteRepository;
        private readonly IStudentRepository _studentRepository;
        private readonly IEventRepository _eventRepository;
        private readonly IUnitOfWork _unitOfWork;

        public AddEventToFavoritesCommandHandler(
            IStudentFavoriteEventRepository favoriteRepository,
            IStudentRepository studentRepository,
            IEventRepository eventRepository,
            IUnitOfWork unitOfWork)
        {
            _favoriteRepository = favoriteRepository;
            _studentRepository = studentRepository;
            _eventRepository = eventRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<Guid>> Handle(AddEventToFavoritesCommand request, CancellationToken cancellationToken)
        {
            // Check if student exists
            var student = await _studentRepository.GetByIdAsync(request.StudentId, cancellationToken);
            if (student is null)
            {
                return Result.Failure<Guid>(ValidationErrors.Student.NotFound);
            }

            // Check if event exists
            var eventEntity = await _eventRepository.GetByIdAsync(request.EventId, cancellationToken);
            if (eventEntity is null)
            {
                return Result.Failure<Guid>(ValidationErrors.Event.NotFound);
            }

            // Check if already favorited
            var existingFavorite = await _favoriteRepository.ExistsByStudentAndEventAsync(
                request.StudentId, request.EventId, cancellationToken);
            
            if (existingFavorite)
            {
                return Result.Failure<Guid>(ValidationErrors.Event.AlreadyFavorited);
            }

            // Create favorite
            var favorite = new StudentFavoriteEvent(request.StudentId, request.EventId);
            
            _favoriteRepository.Add(favorite);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success(favorite.Id);
        }
    }
} 